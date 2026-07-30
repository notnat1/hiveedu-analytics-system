import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AnalyticsService } from '../analytics/analytics.service.js';
import { AuditLogService } from '../audit-log/audit-log.service.js';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly auditLogService: AuditLogService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  @Cron('0 8 * * *')
  async handleAutomatedEarlyWarning() {
    this.logger.log('Running automated early warning job...');

    try {
      const atRiskUsers = await this.analyticsService.getAtRiskUsers();

      for (const { user, predictedScore } of atRiskUsers) {
        // Log the system event for this user
        await this.auditLogService.createLog({
          action: 'AUTOMATED_ALERT_TRIGGERED',
          actorId: null,
          actorRole: 'SYSTEM',
          targetType: 'user',
          targetId: user.userId,
          description: `Automated alert triggered due to predicted score: ${predictedScore}`,
          metadata: {
            predictedScore,
            threshold: 70,
          },
        });

        // Trigger the intervention alert so WhatsApp notification is sent
        this.eventEmitter.emit('intervention.alert', { user });
      }

      this.logger.log(`Early warning job completed. Triggered alerts for ${atRiskUsers.length} users.`);

      // Log the cron job run itself
      await this.auditLogService.createLog({
        action: 'SYSTEM_PREDICTION',
        actorId: null,
        actorRole: 'SYSTEM',
        description: `Automated early warning cron job ran successfully. Found ${atRiskUsers.length} at-risk users.`,
      });

    } catch (error: any) {
      this.logger.error(`Failed to run automated early warning job: ${error.message}`);
    }
  }
}
