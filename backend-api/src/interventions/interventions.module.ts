import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterventionsService } from './interventions.service.js';
import { InterventionsController } from './interventions.controller.js';
import { InterventionNote } from './intervention-note.entity.js';
import { User } from '../users/user.entity.js';
import { AuditLogModule } from '../audit-log/audit-log.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterventionNote, User]),
    AuditLogModule,
  ],
  controllers: [InterventionsController],
  providers: [InterventionsService],
  exports: [InterventionsService],
})
export class InterventionsModule {}
