import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsRecord } from './analytics-record.entity.js';
import { SystemConfig } from './system-config.entity.js';
import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';
import { ParentMailerService } from './parent-mailer.service.js';
import { MlrService } from './mlr.service.js';
import { MlrRunHistory } from './mlr-run-history.entity.js';
import { User } from '../users/user.entity.js';
import { UsersModule } from '../users/users.module.js';
import { RecordEntity } from '../records/record.entity.js';
import { Attendance } from '../attendance/attendance.entity.js';
import { AuditLogModule } from '../audit-log/audit-log.module.js';

/**
 * AnalyticsModule
 * -------------------------------------------------
 * Encapsulates all analytics-related capabilities for the
 * HiveEdu E-Raport platform, including performance prediction
 * for users via Multiple Linear Regression.
 *
 * MLR Model: Y = a + b1X1 + b2X2 + b3X3.
 * X1 is attendance percentage, X2 is average tryout score,
 * X3 is teacher objective score, and MSE validates predicted
 * score against actual exam score.
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase - keep USER role wording consistent.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnalyticsRecord,
      MlrRunHistory,
      SystemConfig,
      User,
      RecordEntity,
      Attendance,
    ]),
    UsersModule,
    AuditLogModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, ParentMailerService, MlrService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
