import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { RecordEntity } from './record.entity.js';
import { CreateRecordDto } from './dto/create-record.dto.js';
import { UpdateRecordDto } from './dto/update-record.dto.js';
import { User } from '../users/user.entity.js';
import { Role } from '../users/role.enum.js';
import { AuditLogService } from '../audit-log/audit-log.service.js';

/**
 * RecordsService
 * -------------------------------------------------
 * Handles persistence and retrieval of academic records
 * for users in the USER role.
 */
@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly auditLogService: AuditLogService,
  ) {}

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

  private assertCanReadUserRecords(
    actor: { actorId?: string | null; actorRole?: string | null },
    user: User,
  ): void {
    if (actor.actorRole === Role.ADMIN) {
      return;
    }

    if (actor.actorRole === Role.TEACHER && user.assignedTutorId === actor.actorId) {
      return;
    }

    if (actor.actorRole === Role.USER && user.userId === actor.actorId) {
      return;
    }

    throw new ForbiddenException(
      'You are not allowed to access academic records for this user account.',
    );
  }

  private assertCanManageUserRecords(
    actor: { actorId?: string | null; actorRole?: string | null },
    user: User,
  ): void {
    if (actor.actorRole === Role.ADMIN) {
      return;
    }

    if (actor.actorRole === Role.TEACHER && user.assignedTutorId === actor.actorId) {
      return;
    }

    throw new ForbiddenException(
      'You are not allowed to manage academic records for this user account.',
    );
  }

  async findAll(actor: {
    actorId?: string | null;
    actorRole?: string | null;
  }): Promise<RecordEntity[]> {
    if (actor.actorRole === Role.ADMIN) {
      return this.recordRepository.find({
        order: { createdAt: 'DESC' },
      });
    }

    if (actor.actorRole === Role.USER && actor.actorId) {
      return this.recordRepository.find({
        where: { userId: actor.actorId },
        order: { createdAt: 'DESC' },
      });
    }

    if (actor.actorRole === Role.TEACHER && actor.actorId) {
      const assignedUsers = await this.userRepository.find({
        where: {
          role: Role.USER,
          assignedTutorId: actor.actorId,
        },
        select: {
        userId: true,
        },
      });

      const assignedUserIds = assignedUsers.map((user) => user.userId);

      if (assignedUserIds.length === 0) {
        return [];
      }

      return this.recordRepository.find({
        where: {
          userId: In(assignedUserIds),
        },
        order: { createdAt: 'DESC' },
      });
    }

    throw new ForbiddenException('You are not allowed to access academic records.');
  }

  async create(
    createRecordDto: CreateRecordDto,
    actor: { actorId?: string | null; actorRole?: string | null },
  ): Promise<RecordEntity> {
    const user = await this.findTargetUser(createRecordDto.userId);
    this.assertCanManageUserRecords(actor, user);

    const mathScore = this.resolveRequiredScore(
      createRecordDto.mathScore,
      createRecordDto.mathematicsScore,
      'mathScore',
    );
    const logicScore = this.resolveRequiredScore(
      createRecordDto.logicScore,
      createRecordDto.logicalReasoningScore,
      'logicScore',
    );
    const englishScore = this.validateScore(createRecordDto.englishScore, 'englishScore');
    const actualExamScore = this.resolveOptionalScore(
      createRecordDto.actualExamScore,
      'actualExamScore',
    );
    const teacherObjectiveScore = this.resolveOptionalScore(
      createRecordDto.teacherObjectiveScore,
      'teacherObjectiveScore',
    );
    const averageScore = this.calculateAverageScore(
      mathScore,
      logicScore,
      englishScore,
    );

    const record = this.recordRepository.create({
      userId: user.userId,
      mathScore,
      logicScore,
      mathematicsScore: mathScore,
      logicalReasoningScore: logicScore,
      englishScore,
      averageScore,
      teacherObjectiveScore,
      teacherFeedback: createRecordDto.teacherFeedback ?? null,
      actualExamScore,
      examDate: createRecordDto.examDate ?? null,
      examLabel: createRecordDto.examLabel ?? null,
      isUsedForTraining: createRecordDto.isUsedForTraining ?? true,
    });

    const savedRecord = await this.recordRepository.save(record);

    await this.auditLogService.createLog({
      action: 'RECORD_CREATED',
      actorId: actor?.actorId ?? null,
      actorRole: actor?.actorRole ?? null,
      targetType: 'record',
      targetId: savedRecord.recordId,
      description: `Created academic record for user "${savedRecord.userId}".`,
      metadata: {
        userId: savedRecord.userId,
        examDate: savedRecord.examDate,
        examLabel: savedRecord.examLabel,
        isUsedForTraining: savedRecord.isUsedForTraining,
        actualExamScore: savedRecord.actualExamScore,
        teacherObjectiveScore: savedRecord.teacherObjectiveScore,
      },
    });

    return savedRecord;
  }

  async update(
    id: string,
    updateRecordDto: UpdateRecordDto,
    actor: { actorId?: string | null; actorRole?: string | null },
  ): Promise<RecordEntity> {
    const record = await this.recordRepository.findOne({ where: { userId: id } });

    if (!record) {
      throw new NotFoundException(`Academic record with ID "${id}" was not found.`);
    }

    const user = await this.findTargetUser(record.userId);
    this.assertCanManageUserRecords(actor, user);

    const originalSnapshot = {
      userId: record.userId,
      examDate: record.examDate,
      examLabel: record.examLabel,
      isUsedForTraining: record.isUsedForTraining,
      actualExamScore: record.actualExamScore,
      teacherObjectiveScore: record.teacherObjectiveScore,
    };

    const nextMathScore = this.resolveUpdatedScore(
      updateRecordDto.mathScore,
      updateRecordDto.mathematicsScore,
      record.mathScore ?? record.mathematicsScore,
      'mathScore',
    );
    const nextLogicScore = this.resolveUpdatedScore(
      updateRecordDto.logicScore,
      updateRecordDto.logicalReasoningScore,
      record.logicScore ?? record.logicalReasoningScore,
      'logicScore',
    );
    const nextEnglishScore =
      typeof updateRecordDto.englishScore === 'undefined'
        ? record.englishScore
        : this.validateScore(updateRecordDto.englishScore, 'englishScore');

    record.mathScore = nextMathScore;
    record.logicScore = nextLogicScore;
    record.mathematicsScore = nextMathScore;
    record.logicalReasoningScore = nextLogicScore;
    record.englishScore = nextEnglishScore;
    record.averageScore = this.calculateAverageScore(
      nextMathScore,
      nextLogicScore,
      nextEnglishScore,
    );

    if (typeof updateRecordDto.teacherFeedback !== 'undefined') {
      record.teacherFeedback = updateRecordDto.teacherFeedback;
    }

    if (typeof updateRecordDto.actualExamScore !== 'undefined') {
      record.actualExamScore = this.resolveOptionalScore(
        updateRecordDto.actualExamScore,
        'actualExamScore',
      );
    }

    if (typeof updateRecordDto.teacherObjectiveScore !== 'undefined') {
      record.teacherObjectiveScore = this.resolveOptionalScore(
        updateRecordDto.teacherObjectiveScore,
        'teacherObjectiveScore',
      );
    }

    if (typeof updateRecordDto.examDate !== 'undefined') {
      record.examDate = updateRecordDto.examDate;
    }

    if (typeof updateRecordDto.examLabel !== 'undefined') {
      record.examLabel = updateRecordDto.examLabel;
    }

    if (typeof updateRecordDto.isUsedForTraining !== 'undefined') {
      record.isUsedForTraining = updateRecordDto.isUsedForTraining;
    }

    const savedRecord = await this.recordRepository.save(record);

    await this.auditLogService.createLog({
      action: 'RECORD_UPDATED',
      actorId: actor?.actorId ?? null,
      actorRole: actor?.actorRole ?? null,
      targetType: 'record',
      targetId: savedRecord.recordId,
      description: `Updated academic record "${savedRecord.recordId}".`,
      metadata: {
        previous: originalSnapshot,
        next: {
          userId: savedRecord.userId,
          examDate: savedRecord.examDate,
          examLabel: savedRecord.examLabel,
          isUsedForTraining: savedRecord.isUsedForTraining,
          actualExamScore: savedRecord.actualExamScore,
          teacherObjectiveScore: savedRecord.teacherObjectiveScore,
        },
      },
    });

    return savedRecord;
  }

  async findByUserId(
    userId: string,
    actor: { actorId?: string | null; actorRole?: string | null },
  ): Promise<RecordEntity[]> {
    const user = await this.findTargetUser(userId);
    this.assertCanReadUserRecords(actor, user);

    return this.recordRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findValidTrainingRecordsByUserId(userId: string): Promise<RecordEntity[]> {
    return this.recordRepository.find({
      where: {
        userId,
        isUsedForTraining: true,
        mathScore: Not(IsNull()),
        logicScore: Not(IsNull()),
        englishScore: Not(IsNull()),
      },
      order: { examDate: 'DESC', createdAt: 'DESC' },
    });
  }

  isTeacherObjectiveScoreReady(record: Pick<RecordEntity, 'teacherObjectiveScore'>): boolean {
    const score = Number(record.teacherObjectiveScore);

    return Number.isFinite(score) && score >= 0 && score <= 100;
  }

  async remove(
    id: string,
    actor: { actorId?: string | null; actorRole?: string | null },
  ): Promise<void> {
    const record = await this.recordRepository.findOne({ where: { userId: id } });

    if (!record) {
      throw new NotFoundException(`Academic record with ID "${id}" was not found.`);
    }

    const user = await this.findTargetUser(record.userId);
    this.assertCanManageUserRecords(actor, user);

    await this.recordRepository.remove(record);

    await this.auditLogService.createLog({
      action: 'RECORD_DELETED',
      actorId: actor?.actorId ?? null,
      actorRole: actor?.actorRole ?? null,
      targetType: 'record',
      targetId: id,
      description: `Deleted academic record "${id}".`,
      metadata: {
        userId: record.userId,
        examDate: record.examDate,
        examLabel: record.examLabel,
      },
    });
  }

  private calculateAverageScore(
    mathScore: number,
    logicScore: number,
    englishScore: number,
  ): number {
    return (mathScore + logicScore + englishScore) / 3;
  }

  private resolveRequiredScore(
    preferredScore: number | undefined,
    fallbackScore: number | undefined,
    fieldName: string,
  ): number {
    const score = preferredScore ?? fallbackScore;

    if (typeof score === 'undefined') {
      throw new BadRequestException(`${fieldName} is required.`);
    }

    return this.validateScore(score, fieldName);
  }

  private resolveUpdatedScore(
    preferredScore: number | undefined,
    fallbackScore: number | undefined,
    currentScore: number,
    fieldName: string,
  ): number {
    const score = preferredScore ?? fallbackScore;

    if (typeof score === 'undefined') {
      return this.validateScore(currentScore, fieldName);
    }

    return this.validateScore(score, fieldName);
  }

  private resolveOptionalScore(
    score: number | null | undefined,
    fieldName: string,
  ): number | null {
    if (typeof score === 'undefined' || score === null) {
      return null;
    }

    return this.validateScore(score, fieldName);
  }

  private validateScore(score: number | null, fieldName: string): number {
    if (score === null) {
      throw new BadRequestException(`${fieldName} must be a number from 0 to 100.`);
    }

    const numericScore = Number(score);

    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100) {
      throw new BadRequestException(`${fieldName} must be a number from 0 to 100.`);
    }

    return numericScore;
  }
}
