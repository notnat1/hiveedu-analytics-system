import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterventionNote } from './intervention-note.entity.js';
import { CreateInterventionDto } from './dto/create-intervention.dto.js';
import { UpdateInterventionDto } from './dto/update-intervention.dto.js';
import { User } from '../users/user.entity.js';
import { Role } from '../users/role.enum.js';
import { AuditLogService } from '../audit-log/audit-log.service.js';

@Injectable()
export class InterventionsService {
  constructor(
    @InjectRepository(InterventionNote)
    private readonly interventionsRepository: Repository<InterventionNote>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createDto: CreateInterventionDto, actor: User): Promise<InterventionNote> {
    const targetUser = await this.usersRepository.findOne({ where: { userId: createDto.userId } });
    if (!targetUser) {
      throw new NotFoundException('User account not found');
    }

    if (actor.role === Role.TEACHER && targetUser.assignedTutorId !== actor.userId) {
      throw new ForbiddenException('You can only manage interventions for your assigned user accounts');
    }

    const note = this.interventionsRepository.create({
      ...createDto,
      createdById: actor.userId,
    });

    const savedNote = await this.interventionsRepository.save(note);

    await this.auditLogService.createLog({
      action: 'INTERVENTION_CREATED',
      actorId: actor.userId,
      actorRole: actor.role,
      targetType: 'INTERVENTION',
      targetId: savedNote.noteId,
      description: `Created intervention note for user account ${targetUser.username}`,
      metadata: { riskLevel: savedNote.riskLevel, status: savedNote.status },
    });

    return savedNote;
  }

  async findAll(actor: User): Promise<InterventionNote[]> {
    if (actor.role === Role.ADMIN) {
      return this.interventionsRepository.find({
        order: { createdAt: 'DESC' },
        relations: ['user', 'createdBy'],
      });
    }

    if (actor.role === Role.TEACHER) {
      return this.interventionsRepository.find({
        where: { user: { assignedTutorId: actor.userId } },
        order: { createdAt: 'DESC' },
        relations: ['user', 'createdBy'],
      });
    }

    throw new ForbiddenException('Access denied');
  }

  async findByUserId(userId: string, actor: User): Promise<InterventionNote[]> {
    const targetUser = await this.usersRepository.findOne({ where: { userId: userId } });
    if (!targetUser) {
      throw new NotFoundException('User account not found');
    }

    if (actor.role === Role.TEACHER && targetUser.assignedTutorId !== actor.userId) {
      throw new ForbiddenException('You can only view interventions for your assigned user accounts');
    }

    if (actor.role === Role.USER) {
      throw new ForbiddenException('Access denied');
    }

    return this.interventionsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['createdBy'],
    });
  }

  async update(id: string, updateDto: UpdateInterventionDto, actor: User): Promise<InterventionNote> {
    const note = await this.interventionsRepository.findOne({
      where: { userId: id },
      relations: ['user'],
    });

    if (!note) {
      throw new NotFoundException('Intervention note not found');
    }

    if (actor.role === Role.TEACHER && note.user.assignedTutorId !== actor.userId) {
      throw new ForbiddenException('You can only manage interventions for your assigned user accounts');
    }

    Object.assign(note, updateDto);
    const updatedNote = await this.interventionsRepository.save(note);

    await this.auditLogService.createLog({
      action: 'INTERVENTION_UPDATED',
      actorId: actor.userId,
      actorRole: actor.role,
      targetType: 'INTERVENTION',
      targetId: updatedNote.noteId,
      description: `Updated intervention note for user account ${note.user.username}`,
      metadata: { riskLevel: updatedNote.riskLevel, status: updatedNote.status },
    });

    return updatedNote;
  }

  async remove(id: string, actor: User): Promise<void> {
    const note = await this.interventionsRepository.findOne({
      where: { userId: id },
      relations: ['user'],
    });

    if (!note) {
      throw new NotFoundException('Intervention note not found');
    }

    if (actor.role === Role.TEACHER && note.user.assignedTutorId !== actor.userId) {
      throw new ForbiddenException('You can only manage interventions for your assigned user accounts');
    }

    await this.interventionsRepository.remove(note);

    await this.auditLogService.createLog({
      action: 'INTERVENTION_DELETED',
      actorId: actor.userId,
      actorRole: actor.role,
      targetType: 'INTERVENTION',
      targetId: id,
      description: `Deleted intervention note for user account ${note.user.username}`,
    });
  }
}
