import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { UsersModule } from '../users/users.module.js';
import { AuditLogModule } from '../audit-log/audit-log.module.js';

/**
 * AuthModule
 * -------------------------------------------------
 * Provides JWT-based authentication and RBAC infrastructure
 * for the HiveEdu E-Raport platform.
 *
 * Exports:
 *   - AuthService  â†’ for generating / validating tokens
 *   - JwtAuthGuard â†’ for protecting routes (import separately)
 *
 * RBAC roles:
 *   - ADMIN   â†’ Data entry operator
 *   - TEACHER â†’ Objective inputs and assessments
 *   - USER    â†’ USER role account (views predictions & reports)
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase â€” keep USER role wording consistent.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    UsersModule,
    AuditLogModule,

    // Async JWT configuration â€” reads secret and expiration from .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'hiveedu_default_secret'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
