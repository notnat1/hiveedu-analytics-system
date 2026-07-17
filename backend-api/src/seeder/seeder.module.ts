import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service.js';
import { SeederController } from './seeder.controller.js';
import { User } from '../users/user.entity.js';
import { AnalyticsRecord } from '../analytics/analytics-record.entity.js';
import { RecordEntity } from '../records/record.entity.js';
import { Attendance } from '../attendance/attendance.entity.js';

/**
 * SeederModule
 * -------------------------------------------------
 * Encapsulates the logic to populate initial dummy
 * data for users and analytics records.
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase â€” keep USER role wording consistent.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User, AnalyticsRecord, RecordEntity, Attendance]),
  ],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
