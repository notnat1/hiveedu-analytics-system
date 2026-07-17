import { BadRequestException, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AuditLogService } from './audit-log.service.js';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  getAuditLogs(
    @Req() req: { user: { role: string } },
    @Query('action') action?: string,
    @Query('actorId') actorId?: string,
    @Query('targetType') targetType?: string,
    @Query('targetId') targetId?: string,
    @Query('limit') limit?: string,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new BadRequestException('Only ADMIN can access audit logs.');
    }

    return this.auditLogService.findLogs({
      action,
      actorId,
      targetType,
      targetId,
      limit: typeof limit === 'string' ? Number(limit) : undefined,
    });
  }
}
