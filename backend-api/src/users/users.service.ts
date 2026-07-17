import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { RecordEntity } from '../records/record.entity.js';
import { Attendance } from '../attendance/attendance.entity.js';
import { AttendanceStatus } from '../attendance/attendance-status.enum.js';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSelfProfileDto } from './dto/update-self-profile.dto';
import { Role } from './role.enum.js';
import { AuditLogService } from '../audit-log/audit-log.service.js';

type SafeAssignedTutor = {
  userId: string;
  fullName: string;
  username: string;
};

type SafeUserResponse = {
  userId: string;
  fullName: string;
  username: string;
  role: Role;
  isActive: boolean;
  assignedTutorId: string | null;
  assignedTutor: SafeAssignedTutor | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * UsersService
 * -------------------------------------------------
 * Handles CRUD operations and queries for User entities.
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase — keep USER role wording consistent.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly auditLogService: AuditLogService,
  ) {}

  toSafeUserResponse(user: User): SafeUserResponse {
    return {
      userId: user.userId,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      assignedTutorId: user.assignedTutorId ?? null,
      assignedTutor: user.assignedTutor
        ? {
            userId: user.assignedTutor.userId,
            fullName: user.assignedTutor.fullName,
            username: user.assignedTutor.username,
          }
        : null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async findHydratedById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { userId: id },
      relations: {
        assignedTutor: true,
      },
    });
  }

  private async resolveAssignedTutorId(
    role: Role,
    assignedTutorId: string | null | undefined,
  ): Promise<string | null> {
    if (role !== Role.USER) {
      return null;
    }

    if (typeof assignedTutorId === 'undefined' || assignedTutorId === null) {
      return null;
    }

    const assignedTutor = await this.userRepository.findOne({
      where: { userId: assignedTutorId, role: Role.TEACHER },
    });

    if (!assignedTutor) {
      throw new BadRequestException(
        'assignedTutorId must reference an existing TEACHER account.',
      );
    }

    return assignedTutor.userId;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private toFiniteNumber(
    value: number | string | null | undefined,
  ): number | null {
    if (value === null || typeof value === 'undefined' || value === '') {
      return null;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  private getAttendancePoint(status: AttendanceStatus): number {
    if (status === AttendanceStatus.PRESENT) {
      return 1;
    }

    if (status === AttendanceStatus.LATE) {
      return 0.5;
    }

    return 0;
  }

  private getValidTrainingRecordAverage(record: RecordEntity): number | null {
    if (record.isUsedForTraining === false) {
      return null;
    }

    const mathScore = this.toFiniteNumber(
      record.mathScore ?? record.mathematicsScore,
    );
    const logicScore = this.toFiniteNumber(
      record.logicScore ?? record.logicalReasoningScore,
    );
    const englishScore = this.toFiniteNumber(record.englishScore);

    if (mathScore === null || logicScore === null || englishScore === null) {
      return null;
    }

    const averageScore = this.toFiniteNumber(record.averageScore);

    if (averageScore !== null) {
      return averageScore;
    }

    return (mathScore + logicScore + englishScore) / 3;
  }

  private async logUserAuditEvent(input: {
    action: string;
    actorId?: string | null;
    actorRole?: string | null;
    targetId: string;
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await this.auditLogService.createLog({
      action: input.action,
      actorId: input.actorId ?? null,
      actorRole: input.actorRole ?? null,
      targetType: 'user',
      targetId: input.targetId,
      description: input.description,
      metadata: input.metadata,
    });
  }

  /** Find a single user by their UUID */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId: id } });
  }

  async getCurrentUserProfile(id: string): Promise<User> {
    const user = await this.findHydratedById(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" was not found.`);
    }

    return user;
  }

  /** Find a single user by their username */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  /** Find a single user by username including the password hash for auth flows */
  async findAuthUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      select: {
        userId: true,
        fullName: true,
        username: true,
        password: true,
        role: true,
        isActive: true,
        assignedTutorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /** Find all users, safely selecting only non-sensitive columns. */
  async findAll(): Promise<SafeUserResponse[]> {
    const users = await this.userRepository.find({
      select: {
        userId: true,
        fullName: true,
        username: true,
        role: true,
        isActive: true,
        assignedTutorId: true,
        createdAt: true,
        updatedAt: true,
        assignedTutor: {
          userId: true,
          fullName: true,
          username: true,
        },
      },
      relations: {
        assignedTutor: true,
      },
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => this.toSafeUserResponse(user));
  }

  /** Find all users that belong to the USER role */
  async findUsersByRoleUser(actor: {
    actorId: string;
    actorRole: string;
  }): Promise<SafeUserResponse[]> {
    if (actor.actorRole !== Role.ADMIN && actor.actorRole !== Role.TEACHER) {
      throw new ForbiddenException(
        'Only ADMIN and TEACHER accounts can access the USER role directory.',
      );
    }

    const users = await this.userRepository.find({
      where: {
        role: Role.USER,
        ...(actor.actorRole === Role.TEACHER
          ? { assignedTutorId: actor.actorId }
          : {}),
      },
      select: {
        userId: true,
        fullName: true,
        username: true,
        role: true,
        isActive: true,
        assignedTutorId: true,
        createdAt: true,
        updatedAt: true,
        assignedTutor: {
          userId: true,
          fullName: true,
          username: true,
        },
      },
      relations: {
        assignedTutor: true,
      },
      order: { username: 'ASC' },
    });

    return users.map((user) => this.toSafeUserResponse(user));
  }

  /** Calculate the latest MLR feature snapshot for a specific user */
  async getLatestFeatures(
    userId: string,
    actor: { actorId: string; actorRole: string },
  ): Promise<{
    userId: string;
    attendancePercentage: number;
    avgTryoutScore: number;
    averageTryoutScore: number;
    x1: number;
    x2: number;
    tryoutCount: number;
    mathematicsScore: number;
    logicalReasoningScore: number;
    englishScore: number;
    latestRecordDate: string | null;
  }> {
    const user = await this.userRepository.findOne({
      where: { userId: userId, role: Role.USER },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" was not found.`);
    }

    if (
      actor.actorRole !== Role.ADMIN &&
      !(
        actor.actorRole === Role.TEACHER && user.assignedTutorId === actor.actorId
      ) &&
      !(actor.actorRole === Role.USER && actor.actorId === user.userId)
    ) {
      throw new ForbiddenException(
        'You are not allowed to access feature data for this user account.',
      );
    }

    const records = await this.recordRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    const attendanceRecords = await this.attendanceRepository.find({
      where: { userId },
    });
    const totalAttendancePoints = attendanceRecords.reduce(
      (sum, attendance) => sum + this.getAttendancePoint(attendance.status),
      0,
    );
    const attendancePercentage =
      attendanceRecords.length === 0
        ? 0
        : totalAttendancePoints / attendanceRecords.length * 100;
    const validTrainingRecords = records
      .map((record) => ({
        record,
        average: this.getValidTrainingRecordAverage(record),
      }))
      .filter(
        (
          recordWithAverage,
        ): recordWithAverage is {
          record: RecordEntity;
          average: number;
        } => recordWithAverage.average !== null,
      );
    const tryoutCount = validTrainingRecords.length;
    const averageTryoutScore =
      tryoutCount === 0
        ? 0
        : validTrainingRecords.reduce(
            (sum, recordWithAverage) => sum + recordWithAverage.average,
            0,
          ) / tryoutCount;
    const latestRecord = records[0];
    const latestMathScore = this.toFiniteNumber(
      latestRecord?.mathScore ?? latestRecord?.mathematicsScore,
    );
    const latestLogicScore = this.toFiniteNumber(
      latestRecord?.logicScore ?? latestRecord?.logicalReasoningScore,
    );
    const latestEnglishScore = this.toFiniteNumber(latestRecord?.englishScore);

    return {
      userId: user.userId,
      attendancePercentage,
      avgTryoutScore: averageTryoutScore,
      averageTryoutScore,
      x1: attendancePercentage,
      x2: averageTryoutScore,
      tryoutCount,
      mathematicsScore: latestMathScore ?? 0,
      logicalReasoningScore: latestLogicScore ?? 0,
      englishScore: latestEnglishScore ?? 0,
      latestRecordDate:
        latestRecord?.examDate ??
        (latestRecord?.createdAt
          ? latestRecord.createdAt.toISOString()
          : null),
    };
  }

  /** Create and save a new user with a hashed password */
  async create(
    createUserDto: CreateUserDto,
    actor?: { actorId?: string | null; actorRole?: string | null },
  ): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const assignedTutorId = await this.resolveAssignedTutorId(
      createUserDto.role,
      createUserDto.assignedTutorId ?? null,
    );

    const user = this.userRepository.create({
      fullName: createUserDto.fullName,
      username: createUserDto.username,
      password: hashedPassword,
      role: createUserDto.role,
      isActive: createUserDto.isActive ?? true,
      assignedTutorId,
    });

    const savedUser = await this.userRepository.save(user);
    const hydratedUser = await this.findHydratedById(savedUser.userId);

    if (!hydratedUser) {
      throw new NotFoundException(`User with ID "${savedUser.userId}" was not found.`);
    }

    await this.logUserAuditEvent({
      action: 'USER_CREATED',
      actorId: actor?.actorId ?? null,
      actorRole: actor?.actorRole ?? null,
      targetId: hydratedUser.userId,
      description: `Created ${hydratedUser.role} account "${hydratedUser.username}".`,
      metadata: {
        role: hydratedUser.role,
        isActive: hydratedUser.isActive,
        assignedTutorId: hydratedUser.assignedTutorId,
      },
    });

    return hydratedUser;
  }

  /** Update a user profile by ID, hashing password only when provided */
  async updateProfile(
    id: string,
    updateUserDto: UpdateUserDto,
    actor?: { actorId?: string | null; actorRole?: string | null },
  ): Promise<User> {
    const existingUser = await this.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" was not found.`);
    }
    const originalRole = existingUser.role;
    const originalIsActive = existingUser.isActive;
    const originalAssignedTutorId = existingUser.assignedTutorId;

    if (!updateUserDto.password || updateUserDto.password.trim() === '') {
      delete updateUserDto.password;
    } else {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    if (typeof updateUserDto.fullName !== 'undefined') {
      existingUser.fullName = updateUserDto.fullName;
    }

    if (typeof updateUserDto.username !== 'undefined') {
      existingUser.username = updateUserDto.username;
    }

    if (typeof updateUserDto.role !== 'undefined') {
      existingUser.role = updateUserDto.role;
    }

    if (typeof updateUserDto.password !== 'undefined') {
      existingUser.password = updateUserDto.password;
    }

    if (typeof updateUserDto.isActive !== 'undefined') {
      existingUser.isActive = updateUserDto.isActive;
    }

    const nextRole = updateUserDto.role ?? existingUser.role;
    if (
      typeof updateUserDto.assignedTutorId !== 'undefined' ||
      nextRole !== existingUser.role
    ) {
      existingUser.assignedTutorId = await this.resolveAssignedTutorId(
        nextRole,
        typeof updateUserDto.assignedTutorId !== 'undefined'
          ? updateUserDto.assignedTutorId
          : existingUser.assignedTutorId,
      );
    } else if (nextRole !== Role.USER) {
      existingUser.assignedTutorId = null;
    }

    const savedUser = await this.userRepository.save(existingUser);
    const hydratedUser = await this.findHydratedById(savedUser.userId);

    if (!hydratedUser) {
      throw new NotFoundException(`User with ID "${savedUser.userId}" was not found.`);
    }

    const changedFields = [
      ...(typeof updateUserDto.fullName !== 'undefined' ? ['fullName'] : []),
      ...(typeof updateUserDto.username !== 'undefined' ? ['username'] : []),
      ...(typeof updateUserDto.password !== 'undefined' ? ['password'] : []),
      ...(typeof updateUserDto.role !== 'undefined' ? ['role'] : []),
      ...(typeof updateUserDto.isActive !== 'undefined' ? ['isActive'] : []),
      ...(typeof updateUserDto.assignedTutorId !== 'undefined' ||
      originalAssignedTutorId !== hydratedUser.assignedTutorId
        ? ['assignedTutorId']
        : []),
    ];

    await this.logUserAuditEvent({
      action: 'USER_UPDATED',
      actorId: actor?.actorId ?? null,
      actorRole: actor?.actorRole ?? null,
      targetId: hydratedUser.userId,
      description: `Updated account "${hydratedUser.username}".`,
      metadata: {
        changedFields,
        role: hydratedUser.role,
        isActive: hydratedUser.isActive,
        assignedTutorId: hydratedUser.assignedTutorId,
      },
    });

    if (originalRole !== hydratedUser.role) {
      await this.logUserAuditEvent({
        action: 'USER_ROLE_UPDATED',
        actorId: actor?.actorId ?? null,
        actorRole: actor?.actorRole ?? null,
        targetId: hydratedUser.userId,
        description: `Updated role for "${hydratedUser.username}" from ${originalRole} to ${hydratedUser.role}.`,
        metadata: {
          fromRole: originalRole,
          toRole: hydratedUser.role,
        },
      });
    }

    if (originalIsActive !== hydratedUser.isActive) {
      await this.logUserAuditEvent({
        action: 'USER_STATUS_UPDATED',
        actorId: actor?.actorId ?? null,
        actorRole: actor?.actorRole ?? null,
        targetId: hydratedUser.userId,
        description: `Updated active status for "${hydratedUser.username}".`,
        metadata: {
          previousIsActive: originalIsActive,
          nextIsActive: hydratedUser.isActive,
        },
      });
    }

    if (originalAssignedTutorId !== hydratedUser.assignedTutorId) {
      await this.logUserAuditEvent({
        action: 'USER_ASSIGNED_TUTOR_UPDATED',
        actorId: actor?.actorId ?? null,
        actorRole: actor?.actorRole ?? null,
        targetId: hydratedUser.userId,
        description: `Updated assigned tutor for "${hydratedUser.username}".`,
        metadata: {
          previousAssignedTutorId: originalAssignedTutorId,
          nextAssignedTutorId: hydratedUser.assignedTutorId,
        },
      });
    }

    return hydratedUser;
  }

  async updateSelfProfile(
    id: string,
    updateSelfProfileDto: UpdateSelfProfileDto,
    actor?: { actorId?: string | null; actorRole?: string | null },
  ): Promise<User> {
    const existingUser = await this.findHydratedById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" was not found.`);
    }

    const nextUsername =
      typeof updateSelfProfileDto.username === 'string'
        ? updateSelfProfileDto.username.trim()
        : undefined;

    if (nextUsername && nextUsername !== existingUser.username) {
      const usernameOwner = await this.findByUsername(nextUsername);

      if (usernameOwner && usernameOwner.userId !== existingUser.userId) {
        throw new BadRequestException('Username already exists.');
      }

      existingUser.username = nextUsername;
    }

    if (typeof updateSelfProfileDto.fullName === 'string') {
      existingUser.fullName = updateSelfProfileDto.fullName;
    }

    if (
      typeof updateSelfProfileDto.password === 'string' &&
      updateSelfProfileDto.password.trim() !== ''
    ) {
      existingUser.password = await this.hashPassword(
        updateSelfProfileDto.password,
      );
    }

    const savedUser = await this.userRepository.save(existingUser);
    const hydratedUser = await this.findHydratedById(savedUser.userId);

    if (!hydratedUser) {
      throw new NotFoundException(`User with ID "${savedUser.userId}" was not found.`);
    }

    const changedFields = [
      ...(typeof updateSelfProfileDto.fullName !== 'undefined'
        ? ['fullName']
        : []),
      ...(typeof updateSelfProfileDto.username !== 'undefined'
        ? ['username']
        : []),
      ...(typeof updateSelfProfileDto.password !== 'undefined'
        ? ['password']
        : []),
    ];

    if (changedFields.length > 0) {
      await this.logUserAuditEvent({
        action: 'USER_UPDATED',
        actorId: actor?.actorId ?? existingUser.userId,
        actorRole: actor?.actorRole ?? existingUser.role,
        targetId: hydratedUser.userId,
        description: `Updated self profile for "${hydratedUser.username}".`,
        metadata: {
          changedFields,
          role: hydratedUser.role,
        },
      });
    }

    return hydratedUser;
  }

  /** Backward-compatible update method */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    actor?: { actorId?: string | null; actorRole?: string | null },
  ): Promise<User> {
    return this.updateProfile(id, updateUserDto, actor);
  }

  /** Mark a user's early warning as acknowledged */
  async acknowledgeWarning(userId: string): Promise<void> {
    const existingUser = await this.findById(userId);
    if (!existingUser) {
      throw new NotFoundException(`User with ID "${userId}" was not found.`);
    }
    
    await this.userRepository.update(userId, { warningAcknowledged: true });
    
    await this.logUserAuditEvent({
      action: 'USER_UPDATED',
      actorId: userId,
      actorRole: existingUser.role,
      targetId: userId,
      description: `User acknowledged early warning alert.`,
      metadata: { warningAcknowledged: true },
    });
  }

  /** Remove a user by their ID */
  async remove(
    id: string,
    actor?: { actorId?: string | null; actorRole?: string | null },
  ): Promise<void> {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" was not found.`);
    }

    await this.userRepository.delete(id);

    await this.logUserAuditEvent({
      action: 'USER_UPDATED',
      actorId: actor?.actorId ?? null,
      actorRole: actor?.actorRole ?? null,
      targetId: id,
      description: `Deleted account "${existingUser.username}".`,
      metadata: {
        deleted: true,
        role: existingUser.role,
        isActive: existingUser.isActive,
        assignedTutorId: existingUser.assignedTutorId,
      },
    });
  }
}

