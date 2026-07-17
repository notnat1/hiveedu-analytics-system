import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { RecordEntity } from '../records/record.entity.js';
import { Attendance } from '../attendance/attendance.entity.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { AuditLogModule } from '../audit-log/audit-log.module.js';

/**
 * UsersModule
 * -------------------------------------------------
 * Encapsulates all user-related capabilities for the
 * HiveEdu E-Raport platform, including RBAC roles
 * (ADMIN, TEACHER, USER).
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase â€” keep USER role wording consistent.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, RecordEntity, Attendance]), AuditLogModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
