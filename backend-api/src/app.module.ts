import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { LoggerMiddleware } from './common/middlewares/logger.middleware.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SeederModule } from './seeder/seeder.module.js';
import { RecordsModule } from './records/records.module.js';
import { AttendanceModule } from './attendance/attendance.module.js';
import { AuditLogModule } from './audit-log/audit-log.module.js';
import { InterventionsModule } from './interventions/interventions.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module.js';
import { CronModule } from './cron/cron.module.js';

/**
 * AppModule â€” Root module for HiveEdu E-Raport backend.
 *
 * NOTE: The term "user" refers to the USER role accounts throughout
 * the entire codebase â€” keep USER role wording consistent.
 */
@Module({
  imports: [
    // Load environment variables from .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),

    // PostgreSQL connection via TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'hiveedu_eraport'),
        autoLoadEntities: true,
        synchronize: config.get<string>('APP_ENV') === 'development',
      }),
    }),

    // Feature modules
    UsersModule,
    AnalyticsModule,
    AuthModule,
    SeederModule,
    RecordsModule,
    AttendanceModule,
    AuditLogModule,
    InterventionsModule,
    EventEmitterModule.forRoot(),
    NotificationsModule,
    CronModule,
    // Security Hardening: Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    // Performance: Caching
    CacheModule.register({
      isGlobal: true,
      ttl: 30000, // 30 seconds default TTL
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
