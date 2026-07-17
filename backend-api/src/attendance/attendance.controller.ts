import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Role } from '../users/role.enum.js';
import { AttendanceService } from './attendance.service.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    return this.attendanceService.create(createAttendanceDto, {
      userId: req.user.userId,
      role: req.user.role as Role,
    });
  }

  @Get('user/:userId')
  findByUserId(
    @Param('userId') userId: string,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    return this.attendanceService.findByUserId(userId, {
      userId: req.user.userId,
      role: req.user.role as Role,
    });
  }

  @Patch(':id')
  update(
    @Param('id') attendanceId: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    return this.attendanceService.update(attendanceId, updateAttendanceDto, {
      userId: req.user.userId,
      role: req.user.role as Role,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id') attendanceId: string,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    await this.attendanceService.remove(attendanceId, {
      userId: req.user.userId,
      role: req.user.role as Role,
    });
    return { success: true };
  }
}
