import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity.js';
import { RecordEntity } from './record.entity.js';
import { RecordsController } from './records.controller.js';
import { RecordsService } from './records.service.js';
import { AuditLogModule } from '../audit-log/audit-log.module.js';
import { XaiModule } from '../xai/xai.module.js';

/**
 * RecordsModule
 * -------------------------------------------------
 * Encapsulates academic record operations bound to users
 * in the USER role.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([RecordEntity, User]),
    AuditLogModule,
    XaiModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}
