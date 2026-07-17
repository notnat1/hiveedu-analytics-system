import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  StreamableFile,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { AnalyticsService } from './analytics.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UpdateAnalyticsConfigDto } from './dto/update-analytics-config.dto.js';
import { PredictPerformanceDto } from './dto/predict-performance.dto.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '../users/role.enum.js';

/**
 * Exposes analytics endpoints for HiveEdu.
 * MLR Model: Y = a + b1X1 + b2X2 + b3X3.
 * X1 is attendance percentage, X2 is average tryout score,
 * X3 is teacher objective score, Y is the predicted next exam score,
 * and MSE validates predictions against actual exam scores.
 * Coefficients can come from AUTO_TRAINED fitting or MANUAL_OVERRIDE values.
 */
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('predict-performance')
  @Roles(Role.ADMIN, Role.TEACHER)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async predictPerformance(
    @Body() dto: PredictPerformanceDto,
  ): Promise<{ predictedPerformance: number }> {
    try {
      const result = await this.analyticsService.predictUserPerformance(
        dto.attendancePercentage,
        dto.avgTryoutScore,
        dto.teacherObjectiveScore ?? 0,
        dto.tryoutCount,
      );

      return { predictedPerformance: result };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Prediction failed.',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @Roles(Role.ADMIN, Role.TEACHER, Role.USER)
  getMyAnalytics(@Req() req: any) {
    return this.analyticsService.getMyAnalytics(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('config')
  @Roles(Role.ADMIN)
  getConfig() {
    return this.analyticsService.getConfig();
  }

  @UseGuards(JwtAuthGuard)
  @Get('tutors')
  @Roles(Role.ADMIN, Role.TEACHER)
  getTutorAnalytics(@Req() req: any) {
    return this.analyticsService.getTutorAnalytics(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('global')
  @Roles(Role.ADMIN)
  getGlobalAnalytics(@Req() req: any) {
    return this.analyticsService.getGlobalAnalytics(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('export')
  @Roles(Role.ADMIN)
  async exportAnalytics(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only ADMIN can export the analytics workbook.',
      );
    }

    const workbookBuffer = await this.analyticsService.exportAnalyticsWorkbook(
      req.user,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="hiveedu-analytics-report.xlsx"',
    );

    return new StreamableFile(workbookBuffer);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mlr-run-history')
  @Roles(Role.ADMIN)
  getMlrRunHistory(@Req() req: any) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only ADMIN can access MLR run history.');
    }

    return this.analyticsService.getMlrRunHistory();
  }

  @UseGuards(JwtAuthGuard)
  @Get('mlr-run-history/:id')
  @Roles(Role.ADMIN)
  getMlrRunHistoryById(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only ADMIN can access MLR run history.');
    }

    return this.analyticsService.getMlrRunHistoryById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('config')
  @Roles(Role.ADMIN)
  async updateConfig(@Req() req: any, @Body() updateConfigDto: UpdateAnalyticsConfigDto) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Unauthorized to update analytics configuration.');
    }

    return this.analyticsService.updateConfig(req.user, updateConfigDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  @Roles(Role.ADMIN, Role.USER)
  async getDashboardData(@Req() req: any) {
    return this.analyticsService.getDashboardData(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @Roles(Role.ADMIN)
  async updateUserAnalytics(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { x1: number; x2: number; x3: number },
  ) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'TEACHER') {
      throw new BadRequestException('Unauthorized to edit user analytics.');
    }

    try {
      await this.analyticsService.updateUserAnalytics(id, body);
      return { success: true };
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Update failed.');
    }
  }
}
