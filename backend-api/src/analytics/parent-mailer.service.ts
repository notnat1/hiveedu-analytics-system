import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsService } from './analytics.service.js';
import { User } from '../users/user.entity.js';
import { Role } from '../users/role.enum.js';

@Injectable()
export class ParentMailerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Cron('0 8 * * 5')
  async sendWeeklyParentMailerPreview(): Promise<void> {
    const users = await this.userRepository.find({
      where: { role: Role.USER },
      relations: ['assignedTutor'],
      order: { fullName: 'ASC', username: 'ASC' },
    });

    for (const user of users) {
      const snapshot = await this.analyticsService.getUserMlrSnapshot(
        user.userId,
      );

      const mockEmailPayload = {
        to: `${user.username}@parent.hiveedu.app`,
        subject: `Weekly E-Raport Summary for ${user.fullName}`,
        tutor: user.assignedTutor
          ? {
              id: user.assignedTutor.userId,
              fullName: user.assignedTutor.fullName,
              username: user.assignedTutor.username,
            }
          : null,
        user: {
          id: user.userId,
          fullName: user.fullName,
          username: user.username,
        },
        metrics: {
          x1Attendance: snapshot ? Number(snapshot.x1.toFixed(1)) : 0,
          x2Tryout: snapshot ? Number(snapshot.x2.toFixed(1)) : 0,
          predictedScore:
            snapshot?.predictedScore === null || !snapshot
              ? null
              : Number(snapshot.predictedScore.toFixed(1)),
          tryoutCount: snapshot?.tryoutCount ?? 0,
          isEligible: snapshot?.isEligible ?? false,
        },
        generatedAt: new Date().toISOString(),
      };

      console.log(
        '[ParentMailerService] Weekly mailer preview payload:',
        mockEmailPayload,
      );
    }
  }
}
