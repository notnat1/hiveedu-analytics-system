import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity.js';
import { AnalyticsRecord } from '../analytics/analytics-record.entity.js';
import { Role } from '../users/role.enum.js';
import { RecordEntity } from '../records/record.entity.js';
import { Attendance } from '../attendance/attendance.entity.js';
import { AttendanceStatus } from '../attendance/attendance-status.enum.js';

type SeedUserProfile = {
  index: number;
  fullName: string;
  username: string;
  isActive: boolean;
  assignedTutorUsername: string;
  tryoutScores: Array<{
    math: number;
    logic: number;
    english: number;
    teacherObjectiveScore?: number | null;
    actualExamScore?: number | null;
    feedback?: string | null;
    examLabel: string;
    examDate: string;
    isUsedForTraining?: boolean;
  }>;
  attendanceStatuses: AttendanceStatus[];
};

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AnalyticsRecord)
    private readonly analyticsRepository: Repository<AnalyticsRecord>,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  private buildTryoutSet(
    examPrefix: string,
    scoreRows: Array<[number, number, number, number | null, string | null]>,
  ) {
    return scoreRows.map(([math, logic, english, actualExamScore, feedback], index) => ({
      math,
      logic,
      english,
      teacherObjectiveScore: this.deriveTeacherObjectiveScore(
        math,
        logic,
        english,
        index,
      ),
      actualExamScore,
      feedback,
      examLabel: `${examPrefix} ${index + 1}`,
      examDate: `2026-0${Math.min(index + 1, 9)}-${String(10 + index).padStart(2, '0')}`,
      isUsedForTraining: true,
    }));
  }

  private deriveTeacherObjectiveScore(
    math: number,
    logic: number,
    english: number,
    index: number,
  ): number {
    const averageScore = (math + logic + english) / 3;
    const assessmentAdjustment = [-2, 1, 0, 2, -1][index % 5];

    return Math.min(
      100,
      Math.max(0, Number((averageScore + assessmentAdjustment).toFixed(2))),
    );
  }

  private getSeedUserProfiles(): SeedUserProfile[] {
    return [
      {
        index: 1,
        fullName: 'Budi Santoso',
        username: 'budi.santoso',
        isActive: true,
        assignedTutorUsername: 'teacher1',
        tryoutScores: this.buildTryoutSet('Diagnostic', [
          [91, 90, 88, 89, 'Excellent consistency and strong analytical focus.'],
          [90, 92, 89, 90, 'Keeps strong momentum across all competencies.'],
          [93, 91, 90, 92, 'Feedback is complete and performance is stable.'],
          [92, 90, 91, 91, 'Shows reliable exam readiness.'],
          [94, 92, 93, 93, 'Top-tier demo sample for safe-zone prediction.'],
        ]),
        attendanceStatuses: [
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
        ],
      },
      {
        index: 2,
        fullName: 'Siti Aminah',
        username: 'siti.aminah',
        isActive: true,
        assignedTutorUsername: 'teacher1',
        tryoutScores: this.buildTryoutSet('Benchmark', [
          [85, 87, 84, 84, 'Strong performance with room to refine pacing.'],
          [86, 85, 83, 85, 'Feedback completed with positive progress.'],
          [88, 86, 84, 86, 'Maintains healthy tryout momentum.'],
          [87, 88, 85, 87, 'Consistent completion and focus.'],
          [89, 87, 86, 88, 'Safe-zone sample with complete records.'],
        ]),
        attendanceStatuses: [
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
        ],
      },
      {
        index: 3,
        fullName: 'Kevin Pratama',
        username: 'kevin.pratama',
        isActive: true,
        assignedTutorUsername: 'teacher1',
        tryoutScores: this.buildTryoutSet('Intervention', [
          [67, 64, 66, 65, 'Needs structured recovery on core concepts.'],
          [65, 63, 64, 64, 'Tryout quality is below safe benchmark.'],
          [68, 65, 67, 66, 'Teacher feedback confirms intervention need.'],
          [66, 62, 65, 63, 'Performance dips when attendance slips.'],
          [69, 64, 66, 65, 'Useful at-risk demo sample.'],
        ]),
        attendanceStatuses: [
          AttendanceStatus.ABSENT,
          AttendanceStatus.LATE,
          AttendanceStatus.ABSENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
          AttendanceStatus.ABSENT,
        ],
      },
      {
        index: 4,
        fullName: 'Ayu Lestari',
        username: 'ayu.lestari',
        isActive: true,
        assignedTutorUsername: 'teacher1',
        tryoutScores: this.buildTryoutSet('Recovery', [
          [78, 80, 79, 77, 'Tryout base is decent but attendance is unstable.'],
          [80, 78, 77, 78, 'Needs stronger session consistency.'],
          [79, 81, 78, 79, 'Feedback completed for monitoring.'],
          [77, 79, 76, 77, 'Performance can recover with better attendance.'],
          [81, 80, 79, 80, 'Balanced profile with medium risk potential.'],
        ]),
        attendanceStatuses: [
          AttendanceStatus.LATE,
          AttendanceStatus.ABSENT,
          AttendanceStatus.LATE,
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
          AttendanceStatus.ABSENT,
        ],
      },
      {
        index: 5,
        fullName: 'Dimas Anggara',
        username: 'dimas.anggara',
        isActive: true,
        assignedTutorUsername: 'teacher2',
        tryoutScores: this.buildTryoutSet('Mastery', [
          [88, 90, 87, 89, 'High-achieving sample for safe-zone analytics.'],
          [89, 88, 90, 88, 'Feedback confirms strong exam readiness.'],
          [90, 89, 88, 90, 'Consistent training-quality dataset.'],
          [91, 90, 89, 91, 'Strong performance with completed feedback.'],
          [89, 91, 90, 90, 'Another safe-zone sample with valid MSE.'],
        ]),
        attendanceStatuses: [
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
        ],
      },
      {
        index: 6,
        fullName: 'Rina Melati',
        username: 'rina.melati',
        isActive: true,
        assignedTutorUsername: 'teacher2',
        tryoutScores: this.buildTryoutSet('Practice', [
          [73, 75, 74, null, 'Feedback completed while monitoring improvement.'],
          [74, 73, 75, null, 'Ground truth pending but complete training sample.'],
          [76, 74, 75, null, 'Useful eligible sample without actual exam score.'],
          [75, 76, 74, null, 'Can support tutor averages and eligibility.'],
          [77, 75, 76, null, 'Stable, moderate demo sample.'],
        ]),
        attendanceStatuses: [
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
          AttendanceStatus.PRESENT,
        ],
      },
      {
        index: 7,
        fullName: 'Rizky Maulana',
        username: 'rizky.maulana',
        isActive: true,
        assignedTutorUsername: 'teacher2',
        tryoutScores: this.buildTryoutSet('Support', [
          [70, 68, 69, null, 'Needs closer tryout support.'],
          [71, 69, 70, null, 'Feedback keeps the user inside monitoring scope.'],
          [69, 70, 68, null, 'Scores are complete and training-ready.'],
          [72, 71, 70, null, 'Valid but at-risk sample without actual exam score.'],
          [70, 69, 71, null, 'Supports early warning demonstration.'],
        ]),
        attendanceStatuses: [
          AttendanceStatus.LATE,
          AttendanceStatus.ABSENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
          AttendanceStatus.ABSENT,
          AttendanceStatus.PRESENT,
        ],
      },
      {
        index: 8,
        fullName: 'Putri Rahayu',
        username: 'putri.rahayu',
        isActive: false,
        assignedTutorUsername: 'teacher2',
        tryoutScores: this.buildTryoutSet('Inactive', [
          [82, 81, 80, 81, 'Inactive sample should be excluded by eligibility.'],
          [81, 80, 82, 82, 'Complete records remain useful for audit.'],
          [83, 82, 81, 82, 'Inactive account stays out of final prediction set.'],
          [80, 81, 79, 80, 'Demo support for inactive exclusion count.'],
          [82, 83, 81, 83, 'Inactive but complete records.'],
        ]),
        attendanceStatuses: [
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
        ],
      },
      {
        index: 9,
        fullName: 'Fajar Siddiq',
        username: 'fajar.siddiq',
        isActive: true,
        assignedTutorUsername: 'teacher1',
        tryoutScores: [
          ...this.buildTryoutSet('Incomplete', [
            [79, 78, 77, null, 'Eligible-looking start but incomplete total count.'],
            [80, 79, 78, null, 'Below minimum complete tryout requirement.'],
            [78, 77, 79, null, 'Used to demonstrate insufficient tryout exclusion.'],
            [81, 80, 79, null, 'Still under the minimum 5 complete tryout rule.'],
          ]),
          {
            math: 82,
            logic: 0,
            english: 0,
            teacherObjectiveScore: 76,
            actualExamScore: null,
            feedback: null,
            examLabel: 'Incomplete 5',
            examDate: '2026-05-14',
            isUsedForTraining: false,
          },
        ],
        attendanceStatuses: [
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
        ],
      },
      {
        index: 10,
        fullName: 'Nadia Safira',
        username: 'nadia.safira',
        isActive: true,
        assignedTutorUsername: 'teacher2',
        tryoutScores: [
          {
            math: 84,
            logic: 83,
            english: 82,
            teacherObjectiveScore: null,
            actualExamScore: null,
            feedback: 'Contains one valid record but also null-score rows for exclusion demo.',
            examLabel: 'Null Mix 1',
            examDate: '2026-01-10',
            isUsedForTraining: true,
          },
          {
            math: 85,
            logic: 84,
            english: 83,
            teacherObjectiveScore: null,
            actualExamScore: null,
            feedback: null,
            examLabel: 'Null Mix 2',
            examDate: '2026-02-11',
            isUsedForTraining: true,
          },
          {
            math: 83,
            logic: 82,
            english: 81,
            teacherObjectiveScore: null,
            actualExamScore: null,
            feedback: null,
            examLabel: 'Null Mix 3',
            examDate: '2026-03-12',
            isUsedForTraining: true,
          },
          {
            math: 82,
            logic: 81,
            english: 80,
            teacherObjectiveScore: null,
            actualExamScore: null,
            feedback: null,
            examLabel: 'Null Mix 4',
            examDate: '2026-04-13',
            isUsedForTraining: true,
          },
          {
            math: 0,
            logic: 84,
            english: 83,
            teacherObjectiveScore: 74,
            actualExamScore: null,
            feedback: null,
            examLabel: 'Null Mix 5',
            examDate: '2026-05-14',
            isUsedForTraining: false,
          },
        ],
        attendanceStatuses: [
          AttendanceStatus.PRESENT,
          AttendanceStatus.PRESENT,
          AttendanceStatus.LATE,
          AttendanceStatus.PRESENT,
          AttendanceStatus.ABSENT,
          AttendanceStatus.PRESENT,
        ],
      },
    ];
  }

  private async clearExistingDemoData(): Promise<void> {
    await this.analyticsRepository.query(
      'TRUNCATE TABLE "analytics_records" CASCADE',
    );
    await this.recordRepository.query('TRUNCATE TABLE "records" CASCADE');
    await this.attendanceRepository.query('TRUNCATE TABLE "attendance" CASCADE');
    await this.userRepository.query('TRUNCATE TABLE "users" CASCADE');
  }

  async runSeed(): Promise<{ message: string }> {
    this.logger.log('Starting HiveEdu final demo seed...');

    await this.clearExistingDemoData();
    this.logger.log(
      'Cleared existing User, RecordEntity, Attendance, and AnalyticsRecord data.',
    );

    const commonPassword = await bcrypt.hash('password123', 10);

    const admin = this.userRepository.create({
      username: 'admin',
      password: commonPassword,
      fullName: 'HiveEdu Admin',
      role: Role.ADMIN,
      isActive: true,
    });

    const teacherOne = this.userRepository.create({
      username: 'teacher1',
      password: commonPassword,
      fullName: 'HiveEdu Teacher 1',
      role: Role.TEACHER,
      isActive: true,
    });

    const teacherTwo = this.userRepository.create({
      username: 'teacher2',
      password: commonPassword,
      fullName: 'HiveEdu Teacher 2',
      role: Role.TEACHER,
      isActive: true,
    });

    const [savedAdmin, savedTeacherOne, savedTeacherTwo] =
      await this.userRepository.save([admin, teacherOne, teacherTwo]);

    const tutorMap = new Map<string, User>([
      [savedTeacherOne.username, savedTeacherOne],
      [savedTeacherTwo.username, savedTeacherTwo],
    ]);

    const seedProfiles = this.getSeedUserProfiles();

    const userEntities = seedProfiles.map((profile) =>
      this.userRepository.create({
        username: profile.username,
        password: commonPassword,
        fullName: profile.fullName,
        role: Role.USER,
        isActive: profile.isActive,
        assignedTutorId: tutorMap.get(profile.assignedTutorUsername)?.userId ?? null,
      }),
    );

    const savedUsers = await this.userRepository.save(userEntities);
    const savedUserMap = new Map(savedUsers.map((user) => [user.username, user]));

    const records: RecordEntity[] = [];
    const attendanceRecords: Attendance[] = [];
    const analyticsSnapshots: AnalyticsRecord[] = [];

    for (const profile of seedProfiles) {
      const savedUser = savedUserMap.get(profile.username);

      if (!savedUser) {
        continue;
      }

      profile.tryoutScores.forEach((entry) => {
        const averageScore = Number(
          ((entry.math + entry.logic + entry.english) / 3).toFixed(2),
        );

        records.push(
          this.recordRepository.create({
            userId: savedUser.userId,
            mathScore: entry.math,
            logicScore: entry.logic,
            mathematicsScore: entry.math,
            logicalReasoningScore: entry.logic,
            englishScore: entry.english,
            averageScore,
            teacherObjectiveScore:
              typeof entry.teacherObjectiveScore === 'undefined'
                ? this.deriveTeacherObjectiveScore(
                    entry.math,
                    entry.logic,
                    entry.english,
                    0,
                  )
                : entry.teacherObjectiveScore,
            teacherFeedback: entry.feedback ?? null,
            actualExamScore: entry.actualExamScore ?? null,
            examDate: entry.examDate,
            examLabel: entry.examLabel,
            isUsedForTraining: entry.isUsedForTraining ?? true,
          }),
        );
      });

      profile.attendanceStatuses.forEach((status, index) => {
        attendanceRecords.push(
          this.attendanceRepository.create({
            userId: savedUser.userId,
            date: `2026-03-${String(10 + index).padStart(2, '0')}`,
            status,
          }),
        );
      });

      const trainingRecords = profile.tryoutScores.filter(
        (entry) => entry.isUsedForTraining !== false,
      );
      const averageTryoutScore =
        trainingRecords.length > 0
          ? Number(
              (
                trainingRecords.reduce(
                  (sum, entry) => sum + (entry.math + entry.logic + entry.english) / 3,
                  0,
                ) / trainingRecords.length
              ).toFixed(2),
            )
          : 0;
      const validTeacherObjectiveScores = trainingRecords
        .map((entry) => entry.teacherObjectiveScore)
        .filter((score): score is number => typeof score === 'number');
      const averageTeacherObjectiveScore =
        validTeacherObjectiveScores.length > 0
          ? Number(
              (
                validTeacherObjectiveScores.reduce((sum, score) => sum + score, 0) /
                validTeacherObjectiveScores.length
              ).toFixed(2),
            )
          : 0;
      const attendancePoints = profile.attendanceStatuses.reduce((sum, status) => {
        if (status === AttendanceStatus.PRESENT) {
          return sum + 1;
        }

        if (status === AttendanceStatus.LATE) {
          return sum + 0.5;
        }

        return sum;
      }, 0);
      const attendancePercentage =
        profile.attendanceStatuses.length > 0
          ? Number(
              (
                (attendancePoints / profile.attendanceStatuses.length) * 100
              ).toFixed(2),
            )
          : 0;
      const actualExamScores = trainingRecords
        .map((entry) => entry.actualExamScore)
        .filter((score): score is number => typeof score === 'number');
      const averageActualExamScore =
        actualExamScores.length > 0
          ? Number(
              (
                actualExamScores.reduce((sum, score) => sum + score, 0) /
                actualExamScores.length
              ).toFixed(2),
            )
          : null;

      analyticsSnapshots.push(
        this.analyticsRepository.create({
          userId: savedUser.userId,
          attendancePercentage,
          avgTryoutScore: averageTryoutScore,
          teacherObjectiveScore: averageTeacherObjectiveScore,
          tryoutCount: trainingRecords.length,
          actualExamScore: averageActualExamScore,
          predictedScore: null,
        }),
      );
    }

    await this.recordRepository.save(records);
    await this.attendanceRepository.save(attendanceRecords);
    await this.analyticsRepository.save(analyticsSnapshots);

    this.logger.log(
      `Created demo accounts: 1 ADMIN, 2 TEACHER, ${savedUsers.length} USER accounts.`,
    );
    this.logger.log(
      `Created ${records.length} academic records, ${attendanceRecords.length} attendance rows, and ${analyticsSnapshots.length} analytics snapshots.`,
    );
    this.logger.log('HiveEdu final demo seed completed successfully.');

    return {
      message:
        'HiveEdu final demo database seeded successfully with role, attendance, and academic record coverage.',
    };
  }
}
