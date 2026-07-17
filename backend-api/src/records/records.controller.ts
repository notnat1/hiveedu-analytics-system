import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { CreateRecordDto } from './dto/create-record.dto.js';
import { UpdateRecordDto } from './dto/update-record.dto.js';
import { RecordsService } from './records.service.js';
import { Role } from '../users/role.enum.js';

/**
 * RecordsController
 * -------------------------------------------------
 * Exposes endpoints for creating and reading academic
 * records tied to user accounts.
 */
@Controller('records')
@UseGuards(JwtAuthGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Get()
  findAll(@Req() req: { user: { userId: string; role: string } }) {
    return this.recordsService.findAll({
      actorId: req.user.userId,
      actorRole: req.user.role,
    });
  }

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  create(
    @Body() createRecordDto: CreateRecordDto,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    return this.recordsService.create(createRecordDto, {
      actorId: req.user.userId,
      actorRole: req.user.role,
    });
  }

  @Get('user/:userId')
  findByUserId(
    @Param('userId') userId: string,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    return this.recordsService.findByUserId(userId, {
      actorId: req.user.userId,
      actorRole: req.user.role,
    });
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    return this.recordsService.update(id, updateRecordDto, {
      actorId: req.user.userId,
      actorRole: req.user.role,
    });
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(
    @Param('id') id: string,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    return this.recordsService.remove(id, {
      actorId: req.user.userId,
      actorRole: req.user.role,
    });
  }
}
