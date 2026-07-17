import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InterventionsService } from './interventions.service.js';
import { CreateInterventionDto } from './dto/create-intervention.dto.js';
import { UpdateInterventionDto } from './dto/update-intervention.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '../users/role.enum.js';
import { User } from '../users/user.entity.js';

@Controller('interventions')
@UseGuards(JwtAuthGuard)
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  create(@Body() createInterventionDto: CreateInterventionDto, @Request() req: { user: User }) {
    return this.interventionsService.create(createInterventionDto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  findAll(@Request() req: { user: User }) {
    return this.interventionsService.findAll(req.user);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.TEACHER)
  findByUserId(@Param('userId') userId: string, @Request() req: { user: User }) {
    return this.interventionsService.findByUserId(userId, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  update(
    @Param('id') id: string,
    @Body() updateInterventionDto: UpdateInterventionDto,
    @Request() req: { user: User },
  ) {
    return this.interventionsService.update(id, updateInterventionDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.interventionsService.remove(id, req.user);
  }
}
