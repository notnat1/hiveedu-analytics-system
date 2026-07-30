import { Module } from '@nestjs/common';
import { CronService } from './cron.service.js';
import { AnalyticsModule } from '../analytics/analytics.module.js';
import { AuditLogModule } from '../audit-log/audit-log.module.js';

@Module({
  imports: [
    AnalyticsModule,
    AuditLogModule,
  ],
  providers: [CronService],
})
export class CronModule {}
