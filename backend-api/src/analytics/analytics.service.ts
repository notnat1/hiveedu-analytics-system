import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AnalyticsRecord } from './analytics-record.entity.js';
import { SystemConfig } from './system-config.entity.js';
import { UpdateAnalyticsConfigDto } from './dto/update-analytics-config.dto.js';
import { MlrService } from './mlr.service.js';
import { User } from '../users/user.entity.js';
import { Role } from '../users/role.enum.js';
import { RecordEntity } from '../records/record.entity.js';
import { Attendance } from '../attendance/attendance.entity.js';
import { CoefficientMode } from './coefficient-mode.enum.js';
import { MlrRunHistory } from './mlr-run-history.entity.js';
import { AttendanceStatus } from '../attendance/attendance-status.enum.js';
import { AuditLogService } from '../audit-log/audit-log.service.js';
import { XaiService } from '../xai/xai.service.js';

type UserMlrSnapshot = {
  x1: number;
  x2: number;
  x3: number;
  tryoutCount: number;
  hasNullScoreValues: boolean;
  hasMissingTeacherObjectiveScore: boolean;
  isEligible: boolean;
  predictedScore: number | null;
  rawPredictedScore: number | null;
};

type EffectiveCoefficients = {
  intercept: number;
  attendanceCoefficient: number;
  tryoutCoefficient: number;
  teacherObjectiveCoefficient: number;
  coefficientMode: CoefficientMode;
};

type TrainingSample = {
  x1: number;
  x2: number;
  x3: number;
  y: number;
};

type AnalyticsConfigResponse = {
  intercept: number;
  attendanceCoefficient: number;
  tryoutCoefficient: number;
  teacherObjectiveCoefficient: number;
  coefficientMode: CoefficientMode;
  x1Weight: number;
  x2Weight: number;
  x3Weight: number;
};

type UserDatasetContext = {
  user: User;
  x1: number;
  x2: number;
  x3: number;
  completeTryoutCount: number;
  hasNullScoreValues: boolean;
  hasMissingTeacherObjectiveScore: boolean;
  isEligible: boolean;
  actualExamScoreAverage: number | null;
  validActualExamScoreCount: number;
  totalAttendanceRecords: number;
  attendancePoints: number;
  feedbackCompleted: boolean;
};

type DatasetQualityStats = {
  totalUserCount: number;
  activeUserCount: number;
  eligibleUserCount: number;
  excludedUserCount: number;
  excludedInactiveCount: number;
  excludedInsufficientTryoutCount: number;
  excludedNullScoreCount: number;
};

type BatchRunSummary = {
  effectiveCoefficients: EffectiveCoefficients;
  coefficientMode: CoefficientMode;
  trainingSampleCount: number;
  fallbackUsed: boolean;
  fallbackReason: string | null;
  mse: number | null;
  predictionCount: number;
  stats: DatasetQualityStats;
};

type BatchRunDataset = {
  contexts: UserDatasetContext[];
  summary: BatchRunSummary;
};

type PredictionExplanation = {
  interceptContribution: number;
  attendanceContribution: number;
  tryoutContribution: number;
  teacherObjectiveContribution: number;
  rawPredictedScore: number;
  predictedScore: number;
};

type TutorUserPrediction = {
  userId: string;
  fullName: string;
  username: string;
  attendancePercentage: number;
  averageTryoutScore: number;
  teacherObjectiveScore: number;
  tryoutCount: number;
  predictedScore: number;
  actualExamScore: number | null;
  riskLevel: 'HIGH' | 'MEDIUM' | 'SAFE';
  suggestedIntervention: string;
  feedbackCompleted: boolean;
  explanation: PredictionExplanation;
  xaiExplanation: string | null;
};

type TutorAnalyticsResponseRow = {
  tutorId: string;
  tutorName: string;
  tutorUsername: string;
  assignedUserCount: number;
  predictedUserCount: number;
  averagePredictedScore: number;
  atRiskUserCount: number;
  averageAttendance: number;
  averageTryoutScore: number;
  feedbackCompletionRate: number;
  userPredictions: TutorUserPrediction[];
  assignedUsers: TutorUserPrediction[];
};

type SelfAnalyticsResponse = {
  userId: string;
  attendancePercentage: number;
  averageTryoutScore: number;
  avgTryoutScore: number;
  teacherObjectiveScore: number;
  x3: number;
  tryoutCount: number;
  predictedScore: number | null;
  riskLevel: 'HIGH' | 'MEDIUM' | 'SAFE' | 'PENDING';
  suggestedIntervention: string;
  recommendation: string;
  formula: 'Y = a + b1X1 + b2X2 + b3X3';
  coefficientMode: CoefficientMode;
  explanation: PredictionExplanation | null;
  xaiExplanation: string | null;
};

type AnalyticsActor = {
  userId: string;
  role: string;
};

/**
 * Provides HiveEdu analytics using the final MLR rule:
 * Y = a + b1X1 + b2X2 + b3X3.
 *
 * X1 is attendance percentage, X2 is average tryout history score,
 * X3 is teacher objective score, and Y is the predicted next exam score. MSE validates predictions
 * against rows that have an actual exam score. Coefficients can come
 * from AUTO_TRAINED fitting or MANUAL_OVERRIDE config values.
 */
@Injectable()
export class AnalyticsService implements OnModuleInit {
  constructor(
    @InjectRepository(AnalyticsRecord)
    private readonly analyticsRecordRepository: Repository<AnalyticsRecord>,
    @InjectRepository(MlrRunHistory)
    private readonly mlrRunHistoryRepository: Repository<MlrRunHistory>,
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepository: Repository<SystemConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly mlrService: MlrService,
    private readonly xaiService: XaiService,
    private readonly auditLogService: AuditLogService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    await this.ensureSystemConfig();
  }

  private normalizeStoredConfig(config: SystemConfig): SystemConfig {
    config.intercept = this.toFiniteNumber(config.intercept, 0);
    config.attendanceCoefficient = this.toFiniteNumber(
      config.attendanceCoefficient,
      this.toFiniteNumber(config.x1Weight, 40) / 100,
    );
    config.tryoutCoefficient = this.toFiniteNumber(
      config.tryoutCoefficient,
      this.toFiniteNumber(config.x2Weight, 50) / 100,
    );
    config.teacherObjectiveCoefficient = this.toFiniteNumber(
      config.teacherObjectiveCoefficient,
      this.toFiniteNumber(config.x3Weight, 10) / 100,
    );
    config.coefficientMode =
      config.coefficientMode ?? CoefficientMode.AUTO_TRAINED;
    config.x1Weight = this.toFiniteNumber(
      config.x1Weight,
      config.attendanceCoefficient * 100,
    );
    config.x2Weight = this.toFiniteNumber(
      config.x2Weight,
      config.tryoutCoefficient * 100,
    );
    config.x3Weight = this.toFiniteNumber(
      config.x3Weight,
      config.teacherObjectiveCoefficient * 100,
    );

    return config;
  }

  private async ensureSystemConfig(): Promise<SystemConfig> {
    const existingConfigs = await this.systemConfigRepository.find({
      order: { createdAt: 'ASC' },
      take: 1,
    });
    const existingConfig = existingConfigs[0];

    if (existingConfig) {
      const normalizedConfig = this.normalizeStoredConfig(existingConfig);
      return this.systemConfigRepository.save(normalizedConfig);
    }

    const config = this.systemConfigRepository.create({
      intercept: 0,
      attendanceCoefficient: 0.4,
      tryoutCoefficient: 0.5,
      teacherObjectiveCoefficient: 0.1,
      coefficientMode: CoefficientMode.AUTO_TRAINED,
      x1Weight: 40,
      x2Weight: 50,
      x3Weight: 10,
    });

    return this.systemConfigRepository.save(config);
  }

  private toFiniteNumber(
    value: number | string | null | undefined,
    fallback: number,
  ): number {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : fallback;
  }

  private roundMetric(value: number, decimals = 2): number {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Number(value.toFixed(decimals));
  }

  private buildConfigResponse(config: SystemConfig): AnalyticsConfigResponse {
    return {
      intercept: config.intercept,
      attendanceCoefficient: config.attendanceCoefficient,
      tryoutCoefficient: config.tryoutCoefficient,
      teacherObjectiveCoefficient: config.teacherObjectiveCoefficient,
      coefficientMode: config.coefficientMode,
      x1Weight: config.x1Weight,
      x2Weight: config.x2Weight,
      x3Weight: config.x3Weight,
    };
  }

  private getStoredCoefficients(config: SystemConfig): EffectiveCoefficients {
    return {
      intercept: config.intercept,
      attendanceCoefficient: config.attendanceCoefficient,
      tryoutCoefficient: config.tryoutCoefficient,
      teacherObjectiveCoefficient: config.teacherObjectiveCoefficient,
      coefficientMode: config.coefficientMode,
    };
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

  private getRiskLevel(predictedScore: number): 'HIGH' | 'MEDIUM' | 'SAFE' {
    if (predictedScore < 60) {
      return 'HIGH';
    }

    if (predictedScore < 75) {
      return 'MEDIUM';
    }

    return 'SAFE';
  }

  private getSuggestedIntervention(
    attendancePercentage: number,
    averageTryoutScore: number,
  ): string {
    if (attendancePercentage < 75 && averageTryoutScore >= 75) {
      return 'Improve attendance consistency.';
    }

    if (attendancePercentage >= 75 && averageTryoutScore < 75) {
      return 'Strengthen tryout practice.';
    }

    if (attendancePercentage < 75 && averageTryoutScore < 75) {
      return 'Assign early intervention.';
    }

    return 'Maintain current progress.';
  }

  private buildExplanation(
    coefficients: EffectiveCoefficients,
    x1: number,
    x2: number,
    x3: number,
  ): PredictionExplanation {
    const interceptContribution = this.roundMetric(coefficients.intercept);
    const attendanceContribution = this.roundMetric(
      coefficients.attendanceCoefficient * x1,
    );
    const tryoutContribution = this.roundMetric(
      coefficients.tryoutCoefficient * x2,
    );
    const teacherObjectiveContribution = this.roundMetric(
      coefficients.teacherObjectiveCoefficient * x3,
    );
    const rawPredictedScore = this.roundMetric(
      coefficients.intercept +
        coefficients.attendanceCoefficient * x1 +
        coefficients.tryoutCoefficient * x2 +
        coefficients.teacherObjectiveCoefficient * x3,
    );
    const predictedScore = this.roundMetric(
      Math.min(100, Math.max(0, rawPredictedScore)),
    );

    return {
      interceptContribution,
      attendanceContribution,
      tryoutContribution,
      teacherObjectiveContribution,
      rawPredictedScore,
      predictedScore,
    };
  }

  private getFeedbackCompleted(records: RecordEntity[]): boolean {
    return records.some(
      (record) =>
        record.isUsedForTraining &&
        typeof record.teacherFeedback === 'string' &&
        record.teacherFeedback.trim().length > 0,
    );
  }

  private calculateTeacherObjectiveScore(records: RecordEntity[]): {
    teacherObjectiveScore: number;
    hasMissingTeacherObjectiveScore: boolean;
  } {
    const completeRecords = records.filter((record) =>
      this.mlrService.isCompleteTryoutRecord(record),
    );
    const validTeacherObjectiveScores = completeRecords
      .map((record) => record.teacherObjectiveScore)
      .filter((score) => Number.isFinite(Number(score)))
      .map((score) => Number(score));

    if (validTeacherObjectiveScores.length === 0) {
      return {
        teacherObjectiveScore: 0,
        hasMissingTeacherObjectiveScore: completeRecords.length > 0,
      };
    }

    return {
      teacherObjectiveScore:
        validTeacherObjectiveScores.reduce((sum, score) => sum + score, 0) /
        validTeacherObjectiveScores.length,
      hasMissingTeacherObjectiveScore:
        validTeacherObjectiveScores.length < completeRecords.length,
    };
  }

  private calculateFeedbackCompletionRate(
    completedUserCount: number,
    assignedUserCount: number,
  ): number {
    if (assignedUserCount === 0) {
      return 0;
    }

    return this.roundMetric((completedUserCount / assignedUserCount) * 100);
  }

  private getExclusionReason(context: UserDatasetContext): string | null {
    if (!context.user.isActive) {
      return 'Inactive user account.';
    }

    if (context.completeTryoutCount < this.mlrService.minimumTryoutHistoryCount) {
      return 'Insufficient complete tryout history.';
    }

    if (context.hasNullScoreValues) {
      return 'Null or invalid tryout score values.';
    }

    if (context.hasMissingTeacherObjectiveScore) {
      return 'Missing teacher objective score values.';
    }

    return null;
  }

  private async buildUserDatasetContexts(): Promise<UserDatasetContext[]> {
    const users = await this.userRepository.find({
      where: { role: Role.USER },
      order: { fullName: 'ASC', username: 'ASC' },
    });

    const contexts = await Promise.all(
      users.map(async (user) => {
        const [attendanceRecords, tryoutRecords] = await Promise.all([
          this.attendanceRepository.find({
            where: { userId: user.userId },
            order: { date: 'DESC', createdAt: 'DESC' },
          }),
          this.recordRepository.find({
            where: { userId: user.userId, isUsedForTraining: true },
            order: { createdAt: 'DESC' },
          }),
        ]);

        const x1 = this.mlrService.calculateAttendancePercentage(attendanceRecords);
        const tryoutSummary =
          this.mlrService.calculateAverageTryoutScore(tryoutRecords);
        const teacherObjectiveSummary =
          this.calculateTeacherObjectiveScore(tryoutRecords);
        const isEligible = this.mlrService.isPredictionEligible({
          role: user.role,
          isActive: user.isActive,
          completeTryoutCount: tryoutSummary.completeTryoutCount,
          hasNullScoreValues: tryoutSummary.hasNullScoreValues,
          hasMissingTeacherObjectiveScore:
            teacherObjectiveSummary.hasMissingTeacherObjectiveScore,
        });
        const attendancePoints = attendanceRecords.reduce(
          (sum, attendance) => sum + this.getAttendancePoint(attendance.status),
          0,
        );
        const validActualExamScores = tryoutRecords
          .filter(
            (record) =>
              this.mlrService.isCompleteTryoutRecord(record) &&
              record.isUsedForTraining &&
              record.actualExamScore !== null &&
              typeof record.actualExamScore !== 'undefined' &&
              Number.isFinite(Number(record.actualExamScore)),
          )
          .map((record) => Number(record.actualExamScore));

        const actualExamScoreAverage =
          validActualExamScores.length === 0
            ? null
            : validActualExamScores.reduce((sum, score) => sum + score, 0) /
              validActualExamScores.length;

        return {
          user,
          x1: this.roundMetric(x1),
          x2: this.roundMetric(tryoutSummary.averageTryoutScore),
          x3: this.roundMetric(teacherObjectiveSummary.teacherObjectiveScore),
          completeTryoutCount: tryoutSummary.completeTryoutCount,
          hasNullScoreValues: tryoutSummary.hasNullScoreValues,
          hasMissingTeacherObjectiveScore:
            teacherObjectiveSummary.hasMissingTeacherObjectiveScore,
          isEligible,
          actualExamScoreAverage:
            actualExamScoreAverage === null
              ? null
              : this.roundMetric(actualExamScoreAverage),
          validActualExamScoreCount: validActualExamScores.length,
          totalAttendanceRecords: attendanceRecords.length,
          attendancePoints: this.roundMetric(attendancePoints),
          feedbackCompleted: this.getFeedbackCompleted(tryoutRecords),
        };
      }),
    );

    return contexts;
  }

  private buildDatasetQualityStats(
    contexts: UserDatasetContext[],
  ): DatasetQualityStats {
    const activeUserCount = contexts.filter((context) => context.user.isActive).length;
    const eligibleUserCount = contexts.filter((context) => context.isEligible).length;
    const excludedInactiveCount = contexts.filter(
      (context) => !context.user.isActive,
    ).length;
    const excludedInsufficientTryoutCount = contexts.filter(
      (context) =>
        context.user.isActive &&
        context.completeTryoutCount < this.mlrService.minimumTryoutHistoryCount,
    ).length;
    const excludedNullScoreCount = contexts.filter(
      (context) =>
        context.user.isActive &&
        context.completeTryoutCount >= this.mlrService.minimumTryoutHistoryCount &&
        (context.hasNullScoreValues || context.hasMissingTeacherObjectiveScore),
    ).length;
    const excludedUserCount =
      excludedInactiveCount +
      excludedInsufficientTryoutCount +
      excludedNullScoreCount;

    return {
      totalUserCount: contexts.length,
      activeUserCount,
      eligibleUserCount,
      excludedUserCount,
      excludedInactiveCount,
      excludedInsufficientTryoutCount,
      excludedNullScoreCount,
    };
  }

  private buildTrainingSamples(contexts: UserDatasetContext[]): TrainingSample[] {
    return contexts
      .filter(
        (context) =>
          context.isEligible && context.actualExamScoreAverage !== null,
      )
      .map((context) => ({
        x1: context.x1,
        x2: context.x2,
        x3: context.x3,
        y: context.actualExamScoreAverage as number,
      }));
  }

  private buildMseFromTrainingSamples(
    trainingSamples: TrainingSample[],
    coefficients: EffectiveCoefficients,
  ): number | null {
    const mseRecords = trainingSamples.map((sample) => ({
      predictedScore: this.mlrService.calculatePredictedScore({
        intercept: coefficients.intercept,
        b1: coefficients.attendanceCoefficient,
        b2: coefficients.tryoutCoefficient,
        b3: coefficients.teacherObjectiveCoefficient,
        x1: sample.x1,
        x2: sample.x2,
        x3: sample.x3,
      }).predictedScore,
      actualExamScore: sample.y,
    }));

    return this.mlrService.calculateMse(mseRecords);
  }

  private async buildBatchRunDataset(): Promise<BatchRunDataset> {
    const [config, contexts] = await Promise.all([
      this.ensureSystemConfig(),
      this.buildUserDatasetContexts(),
    ]);
    const stats = this.buildDatasetQualityStats(contexts);
    const storedCoefficients = this.getStoredCoefficients(config);
    const trainingSamples = this.buildTrainingSamples(contexts);
    let effectiveCoefficients = storedCoefficients;
    let fallbackUsed = false;
    let fallbackReason: string | null = null;
    let trainingSampleCount = trainingSamples.length;

    if (config.coefficientMode === CoefficientMode.AUTO_TRAINED) {
      const fitResult =
        this.mlrService.fitCoefficientsWithMetadata(trainingSamples);

      trainingSampleCount = fitResult.validTrainingSampleCount;

      if (fitResult.success && fitResult.coefficients) {
        effectiveCoefficients = {
          intercept: fitResult.coefficients.intercept,
          attendanceCoefficient: fitResult.coefficients.attendanceCoefficient,
          tryoutCoefficient: fitResult.coefficients.tryoutCoefficient,
          teacherObjectiveCoefficient:
            fitResult.coefficients.teacherObjectiveCoefficient,
          coefficientMode: config.coefficientMode,
        };
      } else {
        fallbackUsed = true;
        fallbackReason = fitResult.reason;
      }
    }

    return {
      contexts,
      summary: {
        effectiveCoefficients,
        coefficientMode: config.coefficientMode,
        trainingSampleCount,
        fallbackUsed,
        fallbackReason,
        mse: this.buildMseFromTrainingSamples(trainingSamples, effectiveCoefficients),
        predictionCount: stats.eligibleUserCount,
        stats,
      },
    };
  }

  private async buildBatchRunSummary(): Promise<BatchRunSummary> {
    return (await this.buildBatchRunDataset()).summary;
  }

  async getMyAnalytics(actor: AnalyticsActor): Promise<SelfAnalyticsResponse> {
    const user = await this.userRepository.findOne({
      where: { userId: actor.userId },
    });

    if (!user) {
      throw new NotFoundException('Authenticated account was not found.');
    }

    const config = await this.ensureSystemConfig();
    const baseResponse = {
      formula: 'Y = a + b1X1 + b2X2 + b3X3' as const,
      coefficientMode: config.coefficientMode,
    };

    if (user.role !== Role.USER) {
      return {
        userId: user.userId,
        attendancePercentage: 0,
        averageTryoutScore: 0,
        avgTryoutScore: 0,
        teacherObjectiveScore: 0,
        x3: 0,
        tryoutCount: 0,
        predictedScore: null,
        riskLevel: 'PENDING',
        suggestedIntervention: 'Personal analytics are available for user accounts.',
        recommendation: 'Personal analytics are available for user accounts.',
        explanation: null,
        xaiExplanation: null,
        ...baseResponse,
      };
    }

    const batchRunDataset = await this.buildBatchRunDataset();
    const context = batchRunDataset.contexts.find(
      (datasetContext) => datasetContext.user.userId === user.userId,
    );
    const attendancePercentage = this.roundMetric(context?.x1 ?? 0);
    const averageTryoutScore = this.roundMetric(context?.x2 ?? 0);
    const teacherObjectiveScore = this.roundMetric(context?.x3 ?? 0);
    const tryoutCount = context?.completeTryoutCount ?? 0;
    const prediction =
      context?.isEligible === true
        ? this.mlrService.calculatePredictedScore({
            intercept:
              batchRunDataset.summary.effectiveCoefficients.intercept,
            b1: batchRunDataset.summary.effectiveCoefficients
              .attendanceCoefficient,
            b2: batchRunDataset.summary.effectiveCoefficients
              .tryoutCoefficient,
            b3: batchRunDataset.summary.effectiveCoefficients
              .teacherObjectiveCoefficient,
            x1: context.x1,
            x2: context.x2,
            x3: context.x3,
          }).predictedScore
        : null;
    const predictedScore =
      prediction === null ? null : this.roundMetric(prediction);
    const suggestedIntervention = this.getSuggestedIntervention(
      attendancePercentage,
      averageTryoutScore,
    );

    const explanation =
      context?.isEligible === true
        ? this.buildExplanation(
            batchRunDataset.summary.effectiveCoefficients,
            context.x1,
            context.x2,
            context.x3,
          )
        : null;

    return {
      userId: user.userId,
      attendancePercentage,
      averageTryoutScore,
      avgTryoutScore: averageTryoutScore,
      teacherObjectiveScore,
      x3: teacherObjectiveScore,
      tryoutCount,
      predictedScore,
      riskLevel:
        predictedScore === null ? 'PENDING' : this.getRiskLevel(predictedScore),
      suggestedIntervention,
      recommendation: suggestedIntervention,
      formula: baseResponse.formula,
      coefficientMode: batchRunDataset.summary.coefficientMode,
      explanation,
      xaiExplanation: context?.isEligible === true && predictedScore !== null
        ? await this.xaiService.generateDynamicExplanationAsync(attendancePercentage, averageTryoutScore, teacherObjectiveScore, predictedScore)
        : null,
    };
  }

  private async saveMlrRunHistory(input: {
    generatedById?: string | null;
    generatedByRole?: string | null;
    notes?: string | null;
    summary: BatchRunSummary;
  }): Promise<MlrRunHistory> {
    const history = this.mlrRunHistoryRepository.create({
      generatedAt: new Date(),
      generatedById: input.generatedById ?? null,
      coefficientMode: input.summary.coefficientMode,
      intercept: input.summary.effectiveCoefficients.intercept,
      attendanceCoefficient:
        input.summary.effectiveCoefficients.attendanceCoefficient,
      tryoutCoefficient: input.summary.effectiveCoefficients.tryoutCoefficient,
      teacherObjectiveCoefficient:
        input.summary.effectiveCoefficients.teacherObjectiveCoefficient,
      mse: input.summary.mse,
      totalUserCount: input.summary.stats.totalUserCount,
      activeUserCount: input.summary.stats.activeUserCount,
      eligibleUserCount: input.summary.stats.eligibleUserCount,
      excludedUserCount: input.summary.stats.excludedUserCount,
      excludedInactiveCount: input.summary.stats.excludedInactiveCount,
      excludedInsufficientTryoutCount:
        input.summary.stats.excludedInsufficientTryoutCount,
      excludedNullScoreCount: input.summary.stats.excludedNullScoreCount,
      trainingSampleCount: input.summary.trainingSampleCount,
      predictionCount: input.summary.predictionCount,
      fallbackUsed: input.summary.fallbackUsed,
      fallbackReason: input.summary.fallbackReason,
      notes: input.notes ?? null,
    });

    const savedHistory = await this.mlrRunHistoryRepository.save(history);

    await this.auditLogService.createLog({
      action: 'MLR_BATCH_RUN',
      actorId: input.generatedById ?? null,
      actorRole: input.generatedByRole ?? null,
      targetType: 'mlr_run_history',
      targetId: savedHistory.historyId,
      description: input.notes ?? 'Saved MLR batch run history.',
      metadata: {
        coefficientMode: savedHistory.coefficientMode,
        mse: savedHistory.mse,
        predictionCount: savedHistory.predictionCount,
        trainingSampleCount: savedHistory.trainingSampleCount,
        fallbackUsed: savedHistory.fallbackUsed,
      },
    });

    return savedHistory;
  }

  private async persistBatchRunHistory(
    actor: AnalyticsActor | undefined,
    notes: string,
    summary: BatchRunSummary,
  ): Promise<MlrRunHistory | null> {
    if (!actor?.userId) {
      return null;
    }

    return this.saveMlrRunHistory({
      generatedById: actor.userId,
      generatedByRole: actor.role,
      notes,
      summary,
    });
  }

  private async getEffectiveCoefficients(): Promise<EffectiveCoefficients> {
    return (await this.buildBatchRunSummary()).effectiveCoefficients;
  }

  private buildTutorUserPrediction(
    context: UserDatasetContext,
    coefficients: EffectiveCoefficients,
  ): TutorUserPrediction | null {
    if (!context.user.isActive || !context.isEligible) {
      return null;
    }

    const predictedScore = this.roundMetric(
      this.mlrService.calculatePredictedScore({
        intercept: coefficients.intercept,
        b1: coefficients.attendanceCoefficient,
        b2: coefficients.tryoutCoefficient,
        b3: coefficients.teacherObjectiveCoefficient,
        x1: context.x1,
        x2: context.x2,
        x3: context.x3,
      }).predictedScore,
    );

    return {
      userId: context.user.userId,
      fullName: context.user.fullName,
      username: context.user.username,
      attendancePercentage: this.roundMetric(context.x1),
      averageTryoutScore: this.roundMetric(context.x2),
      teacherObjectiveScore: this.roundMetric(context.x3),
      tryoutCount: context.completeTryoutCount,
      predictedScore,
      actualExamScore:
        context.actualExamScoreAverage === null
          ? null
          : this.roundMetric(context.actualExamScoreAverage),
      riskLevel: this.getRiskLevel(predictedScore),
      suggestedIntervention: this.getSuggestedIntervention(context.x1, context.x2),
      feedbackCompleted: context.feedbackCompleted,
      explanation: this.buildExplanation(
        coefficients,
        context.x1,
        context.x2,
        context.x3,
      ),
      xaiExplanation: this.xaiService.generateExplanation(
        this.roundMetric(context.x1),
        this.roundMetric(context.x2),
        this.roundMetric(context.x3),
        predictedScore
      ),
    };
  }

  private addWorksheet<T extends object>(
    workbook: ExcelJS.Workbook,
    name: string,
    columns: Array<{ header: string; key: keyof T & string; width?: number }>,
    rows: T[],
  ): void {
    const worksheet = workbook.addWorksheet(name);
    worksheet.columns = columns;

    if (rows.length > 0) {
      worksheet.addRows(rows);
    }

    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  }

  async getConfig(): Promise<AnalyticsConfigResponse> {
    const config = await this.ensureSystemConfig();
    return this.buildConfigResponse(config);
  }

  async updateConfig(
    actor: AnalyticsActor | undefined,
    updateConfigDto: UpdateAnalyticsConfigDto,
  ): Promise<AnalyticsConfigResponse> {
    const config = await this.ensureSystemConfig();
    const previousConfig = this.buildConfigResponse(config);

    if (typeof updateConfigDto.intercept !== 'undefined') {
      config.intercept = updateConfigDto.intercept;
    }

    if (typeof updateConfigDto.attendanceCoefficient !== 'undefined') {
      config.attendanceCoefficient = updateConfigDto.attendanceCoefficient;
      config.x1Weight = updateConfigDto.attendanceCoefficient * 100;
    }

    if (typeof updateConfigDto.tryoutCoefficient !== 'undefined') {
      config.tryoutCoefficient = updateConfigDto.tryoutCoefficient;
      config.x2Weight = updateConfigDto.tryoutCoefficient * 100;
    }

    if (typeof updateConfigDto.teacherObjectiveCoefficient !== 'undefined') {
      config.teacherObjectiveCoefficient =
        updateConfigDto.teacherObjectiveCoefficient;
      config.x3Weight = updateConfigDto.teacherObjectiveCoefficient * 100;
    }

    if (typeof updateConfigDto.coefficientMode !== 'undefined') {
      config.coefficientMode = updateConfigDto.coefficientMode;
    }

    if (typeof updateConfigDto.x1Weight !== 'undefined') {
      config.x1Weight = updateConfigDto.x1Weight;
      config.attendanceCoefficient = updateConfigDto.x1Weight / 100;
    }

    if (typeof updateConfigDto.x2Weight !== 'undefined') {
      config.x2Weight = updateConfigDto.x2Weight;
      config.tryoutCoefficient = updateConfigDto.x2Weight / 100;
    }

    if (typeof updateConfigDto.x3Weight !== 'undefined') {
      config.x3Weight = updateConfigDto.x3Weight;
      config.teacherObjectiveCoefficient = updateConfigDto.x3Weight / 100;
    }

    const savedConfig = await this.systemConfigRepository.save(
      this.normalizeStoredConfig(config),
    );

    await this.auditLogService.createLog({
      action: 'MLR_CONFIG_UPDATED',
      actorId: actor?.userId ?? null,
      actorRole: actor?.role ?? null,
      targetType: 'analytics_config',
      targetId: savedConfig.configId,
      description: 'Updated analytics configuration.',
      metadata: {
        coefficientMode: savedConfig.coefficientMode,
        changedFields: Object.keys(updateConfigDto),
        previousConfig: {
          intercept: previousConfig.intercept,
          attendanceCoefficient: previousConfig.attendanceCoefficient,
          tryoutCoefficient: previousConfig.tryoutCoefficient,
          teacherObjectiveCoefficient:
            previousConfig.teacherObjectiveCoefficient,
          coefficientMode: previousConfig.coefficientMode,
        },
        nextConfig: {
          intercept: savedConfig.intercept,
          attendanceCoefficient: savedConfig.attendanceCoefficient,
          tryoutCoefficient: savedConfig.tryoutCoefficient,
          teacherObjectiveCoefficient:
            savedConfig.teacherObjectiveCoefficient,
          coefficientMode: savedConfig.coefficientMode,
        },
      },
    });

    return this.buildConfigResponse(savedConfig);
  }

  async getUserMlrSnapshot(
    userId: string,
    effectiveCoefficients?: EffectiveCoefficients,
  ): Promise<UserMlrSnapshot | null> {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    if (!user) {
      return null;
    }

    const [attendanceRecords, tryoutRecords, coefficients] = await Promise.all([
      this.attendanceRepository.find({ where: { userId } }),
      this.recordRepository.find({
        where: { userId, isUsedForTraining: true },
        order: { createdAt: 'DESC' },
      }),
      effectiveCoefficients
        ? Promise.resolve(effectiveCoefficients)
        : this.getEffectiveCoefficients(),
    ]);

    const x1 = this.mlrService.calculateAttendancePercentage(attendanceRecords);
    const tryoutSummary =
      this.mlrService.calculateAverageTryoutScore(tryoutRecords);
    const teacherObjectiveSummary =
      this.calculateTeacherObjectiveScore(tryoutRecords);
    const isEligible = this.mlrService.isPredictionEligible({
      role: user.role,
      isActive: user.isActive,
      completeTryoutCount: tryoutSummary.completeTryoutCount,
      hasNullScoreValues: tryoutSummary.hasNullScoreValues,
      hasMissingTeacherObjectiveScore:
        teacherObjectiveSummary.hasMissingTeacherObjectiveScore,
    });
    const prediction = isEligible
      ? this.mlrService.calculatePredictedScore({
          intercept: coefficients.intercept,
          b1: coefficients.attendanceCoefficient,
          b2: coefficients.tryoutCoefficient,
          b3: coefficients.teacherObjectiveCoefficient,
          x1,
          x2: tryoutSummary.averageTryoutScore,
          x3: teacherObjectiveSummary.teacherObjectiveScore,
        })
      : null;

    return {
      x1,
      x2: tryoutSummary.averageTryoutScore,
      x3: teacherObjectiveSummary.teacherObjectiveScore,
      tryoutCount: tryoutSummary.completeTryoutCount,
      hasNullScoreValues: tryoutSummary.hasNullScoreValues,
      hasMissingTeacherObjectiveScore:
        teacherObjectiveSummary.hasMissingTeacherObjectiveScore,
      isEligible,
      predictedScore: prediction?.predictedScore ?? null,
      rawPredictedScore: prediction?.rawScore ?? null,
    };
  }

  async getTutorAnalytics(
    actor?: AnalyticsActor,
  ): Promise<TutorAnalyticsResponseRow[]> {
    const batchRunDataset = await this.buildBatchRunDataset();

    const tutors = await this.userRepository.find({
      where: {
        role: Role.TEACHER,
        ...(actor?.role === Role.TEACHER ? { userId: actor.userId } : {}),
      },
      order: { fullName: 'ASC', username: 'ASC' },
    });

    const tutorAnalyticsRows = tutors.map((tutor) => {
      const activeAssignedContexts = batchRunDataset.contexts.filter(
        (context) =>
          context.user.isActive && context.user.assignedTutorId === tutor.userId,
      );
      const userPredictions = activeAssignedContexts
        .map((context) =>
          this.buildTutorUserPrediction(
            context,
            batchRunDataset.summary.effectiveCoefficients,
          ),
        )
        .filter(
          (prediction): prediction is TutorUserPrediction => prediction !== null,
        );
      const atRiskUserCount = userPredictions.filter(
        (prediction) => prediction.predictedScore < 75,
      ).length;
      const completedFeedbackCount = activeAssignedContexts.filter(
        (context) => context.feedbackCompleted,
      ).length;

      return {
        tutorId: tutor.userId,
        tutorName: tutor.fullName,
        tutorUsername: tutor.username,
        assignedUserCount: activeAssignedContexts.length,
        predictedUserCount: userPredictions.length,
        averagePredictedScore:
          userPredictions.length === 0
            ? 0
            : this.roundMetric(
                userPredictions.reduce(
                  (sum, prediction) => sum + prediction.predictedScore,
                  0,
                ) / userPredictions.length,
              ),
        atRiskUserCount,
        averageAttendance:
          activeAssignedContexts.length === 0
            ? 0
            : this.roundMetric(
                activeAssignedContexts.reduce(
                  (sum, context) => sum + context.x1,
                  0,
                ) / activeAssignedContexts.length,
              ),
        averageTryoutScore:
          activeAssignedContexts.length === 0
            ? 0
            : this.roundMetric(
                activeAssignedContexts.reduce(
                  (sum, context) => sum + context.x2,
                  0,
                ) / activeAssignedContexts.length,
              ),
        feedbackCompletionRate: this.calculateFeedbackCompletionRate(
          completedFeedbackCount,
          activeAssignedContexts.length,
        ),
        userPredictions,
        assignedUsers: userPredictions,
      };
    });

    const predictionCount = tutorAnalyticsRows.reduce(
      (sum, tutor) => sum + tutor.userPredictions.length,
      0,
    );

    await this.persistBatchRunHistory(actor, 'Tutor analytics batch generation.', {
      ...batchRunDataset.summary,
      predictionCount,
    });

    return tutorAnalyticsRows;
  }

  async getGlobalAnalytics(actor?: AnalyticsActor): Promise<{
    averageX1: number;
    averageX2: number;
    averageX3: number;
    averagePredictedScore: number;
    activeUserCount: number;
    predictedUserCount: number;
  }> {
    const batchRunDataset = await this.buildBatchRunDataset();

    await this.persistBatchRunHistory(
      actor,
      'Global analytics batch generation.',
      batchRunDataset.summary,
    );

    const activeUsers = batchRunDataset.contexts.filter(
      (context) => context.user.isActive,
    );

    if (activeUsers.length === 0) {
      return {
        averageX1: 0,
        averageX2: 0,
        averageX3: 0,
        averagePredictedScore: 0,
        activeUserCount: 0,
        predictedUserCount: 0,
      };
    }

    const predictedRows = activeUsers
      .map((context) => {
        const prediction = context.isEligible
          ? this.mlrService.calculatePredictedScore({
              intercept: batchRunDataset.summary.effectiveCoefficients.intercept,
              b1: batchRunDataset.summary.effectiveCoefficients.attendanceCoefficient,
              b2: batchRunDataset.summary.effectiveCoefficients.tryoutCoefficient,
              b3: batchRunDataset.summary.effectiveCoefficients.teacherObjectiveCoefficient,
              x1: context.x1,
              x2: context.x2,
              x3: context.x3,
            }).predictedScore
          : null;

        return prediction;
      })
      .filter((score): score is number => score !== null);

    return {
      averageX1:
        activeUsers.reduce((sum, context) => sum + context.x1, 0) /
        activeUsers.length,
      averageX2:
        activeUsers.reduce((sum, context) => sum + context.x2, 0) /
        activeUsers.length,
      averageX3:
        activeUsers.reduce((sum, context) => sum + context.x3, 0) /
        activeUsers.length,
      averagePredictedScore:
        predictedRows.length === 0
          ? 0
          : predictedRows.reduce((sum, score) => sum + score, 0) /
            predictedRows.length,
      activeUserCount: activeUsers.length,
      predictedUserCount: predictedRows.length,
    };
  }

  async exportAnalyticsWorkbook(actor: AnalyticsActor): Promise<Buffer> {
    const batchRunDataset = await this.buildBatchRunDataset();
    const savedRunHistory = await this.saveMlrRunHistory({
      generatedById: actor.userId,
      generatedByRole: actor.role,
      notes: 'Analytics Excel export generation.',
      summary: batchRunDataset.summary,
    });
    const latestRunHistory = await this.getMlrRunHistory();
    const tutors = await this.userRepository.find({
      where: { role: Role.TEACHER },
      relations: ['assignedUsers'],
      order: { fullName: 'ASC', username: 'ASC' },
    });
    const formula = 'Y = a + b1X1 + b2X2 + b3X3';
    const eligibleRows = batchRunDataset.contexts
      .filter((context) => context.isEligible)
      .map((context) => {
        const predictedScore = this.mlrService.calculatePredictedScore({
          intercept: batchRunDataset.summary.effectiveCoefficients.intercept,
          b1: batchRunDataset.summary.effectiveCoefficients.attendanceCoefficient,
          b2: batchRunDataset.summary.effectiveCoefficients.tryoutCoefficient,
          b3: batchRunDataset.summary.effectiveCoefficients.teacherObjectiveCoefficient,
          x1: context.x1,
          x2: context.x2,
          x3: context.x3,
        }).predictedScore;

        return {
          userId: context.user.userId,
          fullName: context.user.fullName,
          username: context.user.username,
          assignedTutorId: context.user.assignedTutorId ?? '',
          attendancePercentage: Number(context.x1.toFixed(2)),
          averageTryoutScore: Number(context.x2.toFixed(2)),
          teacherObjectiveScore: Number(context.x3.toFixed(2)),
          tryoutCount: context.completeTryoutCount,
          predictedScore: Number(predictedScore.toFixed(2)),
        };
      });
    const excludedRows = batchRunDataset.contexts
      .filter((context) => !context.isEligible)
      .map((context) => ({
        userId: context.user.userId,
        fullName: context.user.fullName,
        username: context.user.username,
        reason: this.getExclusionReason(context) ?? 'Excluded from eligibility.',
      }));
    const predictionRows = eligibleRows.map((row) => ({
      userId: row.userId,
      fullName: row.fullName,
      username: row.username,
      assignedTutorId: row.assignedTutorId,
      attendancePercentage: row.attendancePercentage,
      averageTryoutScore: row.averageTryoutScore,
      teacherObjectiveScore: row.teacherObjectiveScore,
      predictedScore: row.predictedScore,
      riskLevel: this.getRiskLevel(row.predictedScore),
    }));
    const earlyWarningRows = predictionRows
      .filter((row) => row.predictedScore < 75)
      .map((row) => ({
        userId: row.userId,
        fullName: row.fullName,
        username: row.username,
        assignedTutorId: row.assignedTutorId,
        attendancePercentage: row.attendancePercentage,
        averageTryoutScore: row.averageTryoutScore,
        teacherObjectiveScore: row.teacherObjectiveScore,
        predictedScore: row.predictedScore,
        riskLevel: row.riskLevel,
        suggestedIntervention: this.getSuggestedIntervention(
          row.attendancePercentage,
          row.averageTryoutScore,
        ),
      }));
    const tutorRows = tutors.map((tutor) => {
      const assignedContexts = batchRunDataset.contexts.filter(
        (context) => context.user.assignedTutorId === tutor.userId,
      );
      const assignedPredictionRows = predictionRows.filter(
        (row) => row.assignedTutorId === tutor.userId,
      );
      const atRiskUserCount = assignedPredictionRows.filter(
        (row) => row.predictedScore < 75,
      ).length;

      return {
        tutorId: tutor.userId,
        tutorName: tutor.fullName,
        assignedUserCount: assignedContexts.length,
        averagePredictedScore:
          assignedPredictionRows.length === 0
            ? 0
            : Number(
                (
                  assignedPredictionRows.reduce(
                    (sum, row) => sum + row.predictedScore,
                    0,
                  ) / assignedPredictionRows.length
                ).toFixed(2),
              ),
        atRiskUserCount,
        averageAttendance:
          assignedContexts.length === 0
            ? 0
            : Number(
                (
                  assignedContexts.reduce((sum, context) => sum + context.x1, 0) /
                  assignedContexts.length
                ).toFixed(2),
              ),
        averageTryoutScore:
          assignedContexts.length === 0
            ? 0
            : Number(
                (
                  assignedContexts.reduce((sum, context) => sum + context.x2, 0) /
                  assignedContexts.length
                ).toFixed(2),
              ),
        averageTeacherObjectiveScore:
          assignedContexts.length === 0
            ? 0
            : Number(
                (
                  assignedContexts.reduce((sum, context) => sum + context.x3, 0) /
                  assignedContexts.length
                ).toFixed(2),
              ),
      };
    });
    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'HiveEdu Backend';
    workbook.created = new Date();
    workbook.modified = new Date();

    this.addWorksheet(workbook, 'Overview Summary', [
      { header: 'generatedAt', key: 'generatedAt', width: 24 },
      { header: 'coefficientMode', key: 'coefficientMode', width: 18 },
      { header: 'intercept', key: 'intercept', width: 16 },
      { header: 'attendanceCoefficient', key: 'attendanceCoefficient', width: 22 },
      { header: 'tryoutCoefficient', key: 'tryoutCoefficient', width: 20 },
      { header: 'teacherObjectiveCoefficient', key: 'teacherObjectiveCoefficient', width: 28 },
      { header: 'mse', key: 'mse', width: 14 },
      { header: 'totalUserCount', key: 'totalUserCount', width: 16 },
      { header: 'activeUserCount', key: 'activeUserCount', width: 16 },
      { header: 'eligibleUserCount', key: 'eligibleUserCount', width: 17 },
      { header: 'excludedUserCount', key: 'excludedUserCount', width: 17 },
      { header: 'trainingSampleCount', key: 'trainingSampleCount', width: 18 },
      { header: 'predictionCount', key: 'predictionCount', width: 16 },
      { header: 'fallbackUsed', key: 'fallbackUsed', width: 14 },
      { header: 'fallbackReason', key: 'fallbackReason', width: 28 },
    ], [
      {
        generatedAt: savedRunHistory.generatedAt.toISOString(),
        coefficientMode: savedRunHistory.coefficientMode,
        intercept: savedRunHistory.intercept,
        attendanceCoefficient: savedRunHistory.attendanceCoefficient,
        tryoutCoefficient: savedRunHistory.tryoutCoefficient,
        teacherObjectiveCoefficient: savedRunHistory.teacherObjectiveCoefficient,
        mse: savedRunHistory.mse ?? '',
        totalUserCount: savedRunHistory.totalUserCount,
        activeUserCount: savedRunHistory.activeUserCount,
        eligibleUserCount: savedRunHistory.eligibleUserCount,
        excludedUserCount: savedRunHistory.excludedUserCount,
        trainingSampleCount: savedRunHistory.trainingSampleCount,
        predictionCount: savedRunHistory.predictionCount,
        fallbackUsed: savedRunHistory.fallbackUsed,
        fallbackReason: savedRunHistory.fallbackReason ?? '',
      },
    ]);

    this.addWorksheet(workbook, 'Eligible Users', [
      { header: 'userId', key: 'userId', width: 38 },
      { header: 'fullName', key: 'fullName', width: 24 },
      { header: 'username', key: 'username', width: 20 },
      { header: 'assignedTutorId', key: 'assignedTutorId', width: 38 },
      { header: 'attendancePercentage', key: 'attendancePercentage', width: 20 },
      { header: 'averageTryoutScore', key: 'averageTryoutScore', width: 20 },
      { header: 'teacherObjectiveScore', key: 'teacherObjectiveScore', width: 24 },
      { header: 'tryoutCount', key: 'tryoutCount', width: 14 },
      { header: 'predictedScore', key: 'predictedScore', width: 16 },
    ], eligibleRows);

    this.addWorksheet(workbook, 'Excluded Users', [
      { header: 'userId', key: 'userId', width: 38 },
      { header: 'fullName', key: 'fullName', width: 24 },
      { header: 'username', key: 'username', width: 20 },
      { header: 'reason', key: 'reason', width: 32 },
    ], excludedRows);

    this.addWorksheet(workbook, 'Prediction Results', [
      { header: 'userId', key: 'userId', width: 38 },
      { header: 'fullName', key: 'fullName', width: 24 },
      { header: 'username', key: 'username', width: 20 },
      { header: 'assignedTutorId', key: 'assignedTutorId', width: 38 },
      { header: 'attendancePercentage', key: 'attendancePercentage', width: 20 },
      { header: 'averageTryoutScore', key: 'averageTryoutScore', width: 20 },
      { header: 'teacherObjectiveScore', key: 'teacherObjectiveScore', width: 24 },
      { header: 'predictedScore', key: 'predictedScore', width: 16 },
      { header: 'riskLevel', key: 'riskLevel', width: 12 },
    ], predictionRows);

    this.addWorksheet(workbook, 'Early Warning', [
      { header: 'userId', key: 'userId', width: 38 },
      { header: 'fullName', key: 'fullName', width: 24 },
      { header: 'username', key: 'username', width: 20 },
      { header: 'assignedTutorId', key: 'assignedTutorId', width: 38 },
      { header: 'attendancePercentage', key: 'attendancePercentage', width: 20 },
      { header: 'averageTryoutScore', key: 'averageTryoutScore', width: 20 },
      { header: 'teacherObjectiveScore', key: 'teacherObjectiveScore', width: 24 },
      { header: 'predictedScore', key: 'predictedScore', width: 16 },
      { header: 'riskLevel', key: 'riskLevel', width: 12 },
      { header: 'suggestedIntervention', key: 'suggestedIntervention', width: 32 },
    ], earlyWarningRows);

    this.addWorksheet(workbook, 'Tutor Analytics', [
      { header: 'tutorId', key: 'tutorId', width: 38 },
      { header: 'tutorName', key: 'tutorName', width: 24 },
      { header: 'assignedUserCount', key: 'assignedUserCount', width: 18 },
      { header: 'averagePredictedScore', key: 'averagePredictedScore', width: 22 },
      { header: 'atRiskUserCount', key: 'atRiskUserCount', width: 16 },
      { header: 'averageAttendance', key: 'averageAttendance', width: 18 },
      { header: 'averageTryoutScore', key: 'averageTryoutScore', width: 20 },
      { header: 'averageTeacherObjectiveScore', key: 'averageTeacherObjectiveScore', width: 28 },
    ], tutorRows);

    this.addWorksheet(workbook, 'MLR Coefficients', [
      { header: 'formula', key: 'formula', width: 24 },
      { header: 'coefficientMode', key: 'coefficientMode', width: 18 },
      { header: 'intercept', key: 'intercept', width: 16 },
      { header: 'attendanceCoefficient', key: 'attendanceCoefficient', width: 22 },
      { header: 'tryoutCoefficient', key: 'tryoutCoefficient', width: 20 },
      { header: 'teacherObjectiveCoefficient', key: 'teacherObjectiveCoefficient', width: 28 },
      { header: 'fallbackUsed', key: 'fallbackUsed', width: 14 },
      { header: 'fallbackReason', key: 'fallbackReason', width: 28 },
    ], [
      {
        formula,
        coefficientMode: batchRunDataset.summary.coefficientMode,
        intercept: batchRunDataset.summary.effectiveCoefficients.intercept,
        attendanceCoefficient:
          batchRunDataset.summary.effectiveCoefficients.attendanceCoefficient,
        tryoutCoefficient:
          batchRunDataset.summary.effectiveCoefficients.tryoutCoefficient,
        teacherObjectiveCoefficient:
          batchRunDataset.summary.effectiveCoefficients.teacherObjectiveCoefficient,
        fallbackUsed: batchRunDataset.summary.fallbackUsed,
        fallbackReason: batchRunDataset.summary.fallbackReason ?? '',
      },
    ]);

    this.addWorksheet(workbook, 'MSE Validation', [
      { header: 'mse', key: 'mse', width: 16 },
      { header: 'validationSampleCount', key: 'validationSampleCount', width: 22 },
      { header: 'formula', key: 'formula', width: 24 },
      { header: 'description', key: 'description', width: 48 },
    ], [
      {
        mse: batchRunDataset.summary.mse ?? '',
        validationSampleCount: batchRunDataset.summary.trainingSampleCount,
        formula,
        description: '3-variable MLR prediction: Y = a + b1*X1 + b2*X2 + b3*X3',
      },
    ]);

    this.addWorksheet(workbook, 'Raw Attendance Aggregates', [
      { header: 'userId', key: 'userId', width: 38 },
      { header: 'fullName', key: 'fullName', width: 24 },
      { header: 'totalAttendanceRecords', key: 'totalAttendanceRecords', width: 22 },
      { header: 'attendancePoints', key: 'attendancePoints', width: 18 },
      { header: 'attendancePercentage', key: 'attendancePercentage', width: 20 },
    ], batchRunDataset.contexts.map((context) => ({
      userId: context.user.userId,
      fullName: context.user.fullName,
      totalAttendanceRecords: context.totalAttendanceRecords,
      attendancePoints: Number(context.attendancePoints.toFixed(2)),
      attendancePercentage: Number(context.x1.toFixed(2)),
    })));

    this.addWorksheet(workbook, 'Raw Tryout Aggregates', [
      { header: 'userId', key: 'userId', width: 38 },
      { header: 'fullName', key: 'fullName', width: 24 },
      { header: 'tryoutCount', key: 'tryoutCount', width: 14 },
      { header: 'averageTryoutScore', key: 'averageTryoutScore', width: 20 },
      { header: 'averageTeacherObjectiveScore', key: 'averageTeacherObjectiveScore', width: 28 },
      { header: 'validActualExamScoreCount', key: 'validActualExamScoreCount', width: 24 },
      { header: 'averageActualExamScore', key: 'averageActualExamScore', width: 22 },
    ], batchRunDataset.contexts.map((context) => ({
      userId: context.user.userId,
      fullName: context.user.fullName,
      tryoutCount: context.completeTryoutCount,
      averageTryoutScore: Number(context.x2.toFixed(2)),
      averageTeacherObjectiveScore: Number(context.x3.toFixed(2)),
      validActualExamScoreCount: context.validActualExamScoreCount,
      averageActualExamScore:
        context.actualExamScoreAverage === null
          ? ''
          : Number(context.actualExamScoreAverage.toFixed(2)),
    })));

    this.addWorksheet(workbook, 'MLR Run History', [
      { header: 'generatedAt', key: 'generatedAt', width: 24 },
      { header: 'generatedById', key: 'generatedById', width: 38 },
      { header: 'coefficientMode', key: 'coefficientMode', width: 18 },
      { header: 'intercept', key: 'intercept', width: 16 },
      { header: 'attendanceCoefficient', key: 'attendanceCoefficient', width: 22 },
      { header: 'tryoutCoefficient', key: 'tryoutCoefficient', width: 20 },
      { header: 'teacherObjectiveCoefficient', key: 'teacherObjectiveCoefficient', width: 28 },
      { header: 'mse', key: 'mse', width: 14 },
      { header: 'totalUserCount', key: 'totalUserCount', width: 16 },
      { header: 'activeUserCount', key: 'activeUserCount', width: 16 },
      { header: 'eligibleUserCount', key: 'eligibleUserCount', width: 17 },
      { header: 'excludedUserCount', key: 'excludedUserCount', width: 17 },
      { header: 'trainingSampleCount', key: 'trainingSampleCount', width: 18 },
      { header: 'predictionCount', key: 'predictionCount', width: 16 },
      { header: 'fallbackUsed', key: 'fallbackUsed', width: 14 },
      { header: 'fallbackReason', key: 'fallbackReason', width: 28 },
      { header: 'notes', key: 'notes', width: 28 },
    ], latestRunHistory.map((history) => ({
      generatedAt: history.generatedAt.toISOString(),
      generatedById: history.generatedById ?? '',
      coefficientMode: history.coefficientMode,
      intercept: history.intercept,
      attendanceCoefficient: history.attendanceCoefficient,
      tryoutCoefficient: history.tryoutCoefficient,
      teacherObjectiveCoefficient: history.teacherObjectiveCoefficient,
      mse: history.mse ?? '',
      totalUserCount: history.totalUserCount,
      activeUserCount: history.activeUserCount,
      eligibleUserCount: history.eligibleUserCount,
      excludedUserCount: history.excludedUserCount,
      trainingSampleCount: history.trainingSampleCount,
      predictionCount: history.predictionCount,
      fallbackUsed: history.fallbackUsed,
      fallbackReason: history.fallbackReason ?? '',
      notes: history.notes ?? '',
    })));

    const workbookBuffer = await workbook.xlsx.writeBuffer();

    await this.auditLogService.createLog({
      action: 'ANALYTICS_EXPORTED',
      actorId: actor.userId,
      actorRole: actor.role,
      targetType: 'analytics_export',
      targetId: savedRunHistory.historyId,
      description: 'Exported analytics workbook.',
      metadata: {
        mlrRunHistoryId: savedRunHistory.historyId,
        mse: savedRunHistory.mse,
        predictionCount: savedRunHistory.predictionCount,
      },
    });

    return Buffer.isBuffer(workbookBuffer)
      ? workbookBuffer
      : Buffer.from(workbookBuffer);
  }

  async predictUserPerformance(
    x1Attendance: number,
    x2AvgTryoutScore: number,
    x3TeacherObjectiveScore: number,
    tryoutCount: number,
  ): Promise<number> {
    if (tryoutCount < this.mlrService.minimumTryoutHistoryCount) {
      throw new Error(
        `Prediction requires a minimum of ${this.mlrService.minimumTryoutHistoryCount} complete tryout histories. ` +
          `Current count: ${tryoutCount}.`,
      );
    }

    const coefficients = await this.getEffectiveCoefficients();

    return this.mlrService.calculatePredictedScore({
      intercept: coefficients.intercept,
      b1: coefficients.attendanceCoefficient,
      b2: coefficients.tryoutCoefficient,
      b3: coefficients.teacherObjectiveCoefficient,
      x1: x1Attendance,
      x2: x2AvgTryoutScore,
      x3: x3TeacherObjectiveScore,
    }).predictedScore;
  }

  computeMSE(
    records: Array<{ predictedScore: number | null; actualExamScore: number | null }>,
  ): number | null {
    return this.mlrService.calculateMse(records);
  }

  async getDashboardData(user: AnalyticsActor) {
    const shouldPersistRunHistory = user.role !== Role.USER;
    const batchRunDataset = shouldPersistRunHistory
      ? await this.buildBatchRunDataset()
      : null;
    const whereClause: any = {
      user: {
        role: Role.USER,
        isActive: true,
      },
    };

    if (user.role === Role.USER) {
      whereClause.user.userId = user.userId;
    }

    const records = await this.analyticsRecordRepository.find({
      relations: ['user'],
      where: whereClause,
    });
    const effectiveCoefficients =
      batchRunDataset?.summary.effectiveCoefficients ??
      (await this.getEffectiveCoefficients());

    const dashboardRows = records.map((record) => {
      const x1 = Number(record.attendancePercentage);
      const x2 = Number(record.avgTryoutScore);
      const isEligible = this.mlrService.isPredictionEligible({
        role: record.user.role,
        isActive: record.user.isActive,
        completeTryoutCount: Number(record.tryoutCount),
        hasNullScoreValues:
          record.attendancePercentage === null ||
          record.avgTryoutScore === null,
        hasMissingTeacherObjectiveScore:
          record.teacherObjectiveScore === null ||
          !Number.isFinite(Number(record.teacherObjectiveScore)),
      });
      const predictedScore = isEligible
        ? this.mlrService
            .calculatePredictedScore({
              intercept: effectiveCoefficients.intercept,
              b1: effectiveCoefficients.attendanceCoefficient,
              b2: effectiveCoefficients.tryoutCoefficient,
              b3: effectiveCoefficients.teacherObjectiveCoefficient,
              x1,
              x2,
              x3: Number(record.teacherObjectiveScore),
            })
            .predictedScore.toFixed(1)
        : 'N/A';

      return {
        id: record.analyticsId,
        name: record.user.fullName,
        x1: `${x1.toFixed(1)}%`,
        x2: x2.toFixed(1),
        x3: Number(record.teacherObjectiveScore).toFixed(1),
        predicted: predictedScore,
      };
    });

    if (batchRunDataset) {
      await this.persistBatchRunHistory(
        user,
        'Dashboard analytics batch generation.',
        batchRunDataset.summary,
      );
    }

    return dashboardRows;
  }

  async getMlrRunHistory(): Promise<MlrRunHistory[]> {
    return this.mlrRunHistoryRepository.find({
      order: { generatedAt: 'DESC', createdAt: 'DESC' },
    });
  }

  async getMlrRunHistoryById(id: string): Promise<MlrRunHistory> {
    const history = await this.mlrRunHistoryRepository.findOne({
      where: { historyId: id },
    });

    if (!history) {
      throw new NotFoundException(`MLR run history with ID "${id}" was not found.`);
    }

    return history;
  }

  async updateUserAnalytics(
    id: string,
    dto: { x1: number; x2: number; x3: number },
  ): Promise<void> {
    const record = await this.analyticsRecordRepository.findOne({
      where: { analyticsId: id },
    });

    if (!record) {
      throw new Error(`Analytics record with ID "${id}" was not found.`);
    }

    record.attendancePercentage = dto.x1;
    record.avgTryoutScore = dto.x2;
    record.teacherObjectiveScore = dto.x3;

    await this.analyticsRecordRepository.save(record);
  }

  @OnEvent('auth.login.success')
  async handleUserLogin(user: User) {
    if (user.role !== Role.USER) return;
    
    try {
      const analytics = await this.getMyAnalytics(user);
      if (analytics.riskLevel === 'MEDIUM' || analytics.riskLevel === 'HIGH') {
        this.eventEmitter.emit('intervention.alert', {
          user,
          predictionData: {
            riskLevel: analytics.riskLevel,
            predictedScore: analytics.predictedScore,
            prescriptions: [
              { action: 'Recommendation', module: analytics.recommendation }
            ]
          }
        });
      }
    } catch (e) {
      Logger.error(`Error processing login analytics for user ${user.userId}: ${e}`);
    }
  }

  async getAtRiskUsers(): Promise<{ user: User; predictedScore: number }[]> {
    const batchRunDataset = await this.buildBatchRunDataset();
    const eligibleContexts = batchRunDataset.contexts.filter((c) => c.isEligible);
    
    const atRiskUsers = [];
    for (const context of eligibleContexts) {
      const predictedScore = this.mlrService.calculatePredictedScore({
        intercept: batchRunDataset.summary.effectiveCoefficients.intercept,
        b1: batchRunDataset.summary.effectiveCoefficients.attendanceCoefficient,
        b2: batchRunDataset.summary.effectiveCoefficients.tryoutCoefficient,
        b3: batchRunDataset.summary.effectiveCoefficients.teacherObjectiveCoefficient,
        x1: context.x1,
        x2: context.x2,
        x3: context.x3,
      }).predictedScore;
      
      if (predictedScore < 70) {
        atRiskUsers.push({ user: context.user, predictedScore: this.roundMetric(predictedScore) });
      }
    }
    
    return atRiskUsers;
  }
}
