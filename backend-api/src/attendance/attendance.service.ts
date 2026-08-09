import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { User } from '../users/user.entity.js';
import { Role } from '../users/role.enum.js';
import { AttendanceStatus } from './attendance-status.enum.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
import { AuditLogService } from '../audit-log/audit-log.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';

type AttendanceActor = {
  userId: string;
  role: Role;
};

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly auditLogService: AuditLogService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  normalizeAttendanceDate(value: string): string {
    const trimmedValue = value.trim();
    const datePrefixMatch = trimmedValue.match(/^(\d{4}-\d{2}-\d{2})/);

    if (datePrefixMatch) {
      const normalizedDate = datePrefixMatch[1];
      const parsedDate = new Date(`${normalizedDate}T00:00:00.000Z`);

      if (Number.isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Attendance date must be a valid date.');
      }

      return normalizedDate;
    }

    const parsedDate = new Date(trimmedValue);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Attendance date must be a valid date.');
    }

    return parsedDate.toISOString().slice(0, 10);
  }

  getAttendancePoint(status: AttendanceStatus): number {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return 1;
      case AttendanceStatus.LATE:
        return 0.5;
      case AttendanceStatus.ABSENT:
        return 0;
      default:
        return 0;
    }
  }

  calculateAttendancePercentage(attendanceRecords: Attendance[]): number {
    if (attendanceRecords.length === 0) {
      return 0;
    }

    const totalPoints = attendanceRecords.reduce(
      (sum, record) => sum + this.getAttendancePoint(record.status),
      0,
    );

    return (totalPoints / attendanceRecords.length) * 100;
  }

  async assertNoDuplicateAttendance(
    userId: string,
    date: string,
    excludeAttendanceId?: string,
  ): Promise<void> {
    const existingAttendance = await this.attendanceRepository.findOne({
      where: { userId, date },
    });

    if (
      existingAttendance &&
      (!excludeAttendanceId ||
        existingAttendance.attendanceId !== excludeAttendanceId)
    ) {
      throw new ConflictException(
        `Attendance for user "${userId}" on "${date}" already exists.`,
      );
    }
  }

  assertCanManageUserAttendance(actor: AttendanceActor, user: User): void {
    if (actor.role === Role.ADMIN) {
      return;
    }

    if (actor.role === Role.USER) {
      throw new ForbiddenException(
        'USER accounts are not allowed to manage attendance records.',
      );
    }

    if (actor.role === Role.TEACHER && user.assignedTutorId !== actor.userId) {
      throw new ForbiddenException(
        'TEACHER accounts can only manage attendance for assigned user accounts.',
      );
    }
  }

  private assertCanReadUserAttendance(
    actor: AttendanceActor,
    user: User,
  ): void {
    if (actor.role === Role.ADMIN) {
      return;
    }

    if (actor.role === Role.TEACHER && user.assignedTutorId === actor.userId) {
      return;
    }

    if (actor.role === Role.USER && actor.userId === user.userId) {
      return;
    }

    throw new ForbiddenException(
      'You are not allowed to access attendance for this user account.',
    );
  }

  private async findTargetUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { userId: userId, role: Role.USER },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID "${userId}" was not found in role USER.`,
      );
    }

    return user;
  }

  async create(
    createAttendanceDto: CreateAttendanceDto,
    actor: AttendanceActor,
  ): Promise<Attendance> {
    const user = await this.findTargetUser(createAttendanceDto.userId);
    this.assertCanManageUserAttendance(actor, user);

    const normalizedDate = this.normalizeAttendanceDate(
      createAttendanceDto.date,
    );
    await this.assertNoDuplicateAttendance(user.userId, normalizedDate);

    const attendance = this.attendanceRepository.create({
      userId: user.userId,
      date: normalizedDate,
      status: createAttendanceDto.status,
    });

    const savedAttendance = await this.attendanceRepository.save(attendance);

    await this.auditLogService.createLog({
      action: 'ATTENDANCE_CREATED',
      actorId: actor.userId,
      actorRole: actor.role,
      targetType: 'attendance',
      targetId: savedAttendance.attendanceId,
      description: `Created attendance for user "${user.userId}" on "${savedAttendance.date}".`,
      metadata: {
        userId: savedAttendance.userId,
        date: savedAttendance.date,
        status: savedAttendance.status,
      },
    });

    this.eventEmitter.emit('user.academic.updated', {
      userId: savedAttendance.userId,
    });

    return savedAttendance;
  }

  async findByUserId(
    userId: string,
    actor: AttendanceActor,
  ): Promise<Attendance[]> {
    const user = await this.findTargetUser(userId);

    let isParentOfUser = false;
    if (actor.role === Role.PARENT && actor.userId) {
      const parentUser = await this.userRepository.findOne({
        where: { userId: actor.userId },
      });
      if (parentUser && parentUser.linkedStudentId === user.userId) {
        isParentOfUser = true;
      }
    }

    if (!isParentOfUser) {
      this.assertCanReadUserAttendance(actor, user);
    }

    return this.attendanceRepository.find({
      where: { userId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async update(
    attendanceId: string,
    updateAttendanceDto: UpdateAttendanceDto,
    actor: AttendanceActor,
  ): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { userId: attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance with ID "${attendanceId}" was not found.`,
      );
    }

    const previousUserId = attendance.userId;
    const previousDate = attendance.date;
    const previousStatus = attendance.status;
    const nextUserId = updateAttendanceDto.userId ?? attendance.userId;
    const user = await this.findTargetUser(nextUserId);
    this.assertCanManageUserAttendance(actor, user);

    const nextDate = this.normalizeAttendanceDate(
      updateAttendanceDto.date ?? attendance.date,
    );

    await this.assertNoDuplicateAttendance(
      user.userId,
      nextDate,
      attendance.attendanceId,
    );

    attendance.userId = user.userId;
    attendance.date = nextDate;

    if (updateAttendanceDto.status) {
      attendance.status = updateAttendanceDto.status;
    }

    const savedAttendance = await this.attendanceRepository.save(attendance);

    await this.auditLogService.createLog({
      action: 'ATTENDANCE_UPDATED',
      actorId: actor.userId,
      actorRole: actor.role,
      targetType: 'attendance',
      targetId: savedAttendance.attendanceId,
      description: `Updated attendance for user "${savedAttendance.userId}" on "${savedAttendance.date}".`,
      metadata: {
        previousUserId,
        previousDate,
        previousStatus,
        nextUserId: savedAttendance.userId,
        nextDate: savedAttendance.date,
        nextStatus: savedAttendance.status,
      },
    });

    this.eventEmitter.emit('user.academic.updated', {
      userId: savedAttendance.userId,
    });

    return savedAttendance;
  }

  async remove(attendanceId: string, actor: AttendanceActor): Promise<void> {
    const attendance = await this.attendanceRepository.findOne({
      where: { userId: attendanceId },
    });

    if (!attendance) {
      throw new NotFoundException(
        `Attendance with ID "${attendanceId}" was not found.`,
      );
    }

    const user = await this.findTargetUser(attendance.userId);
    this.assertCanManageUserAttendance(actor, user);

    await this.attendanceRepository.remove(attendance);

    await this.auditLogService.createLog({
      action: 'ATTENDANCE_DELETED',
      actorId: actor.userId,
      actorRole: actor.role,
      targetType: 'attendance',
      targetId: attendanceId,
      description: `Deleted attendance for user "${attendance.userId}" on "${attendance.date}".`,
      metadata: {
        userId: attendance.userId,
        date: attendance.date,
        status: attendance.status,
      },
    });

    this.eventEmitter.emit('user.academic.updated', {
      userId: attendance.userId,
    });
  }
}
