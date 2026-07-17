import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity.js';

type CreateAuditLogInput = {
  action: string;
  actorId?: string | null;
  actorRole?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  description: string;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

type FindAuditLogsOptions = {
  action?: string;
  actorId?: string;
  targetType?: string;
  targetId?: string;
  limit?: number;
};

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  private sanitizeMetadataValue(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.slice(0, 25).map((item) => this.sanitizeMetadataValue(item));
    }

    if (value && typeof value === 'object') {
      const sanitizedEntries = Object.entries(value as Record<string, unknown>)
        .filter(([key]) => {
          const normalizedKey = key.toLowerCase();
          return ![
            'password',
            'passwordhash',
            'hash',
            'token',
            'accesstoken',
            'refreshtoken',
            'authorization',
          ].includes(normalizedKey);
        })
        .map(([key, nestedValue]) => [key, this.sanitizeMetadataValue(nestedValue)]);

      return Object.fromEntries(sanitizedEntries);
    }

    if (typeof value === 'string') {
      return value.length > 500 ? `${value.slice(0, 497)}...` : value;
    }

    return value;
  }

  private sanitizeMetadata(
    metadata?: Record<string, unknown> | null,
  ): Record<string, unknown> | null {
    if (!metadata) {
      return null;
    }

    const sanitizedMetadata = this.sanitizeMetadataValue(metadata);
    return sanitizedMetadata && typeof sanitizedMetadata === 'object'
      ? (sanitizedMetadata as Record<string, unknown>)
      : null;
  }

  async createLog(input: CreateAuditLogInput): Promise<void> {
    try {
      const log = this.auditLogRepository.create({
        action: input.action,
        actorId: input.actorId ?? null,
        actorRole: input.actorRole ?? null,
        targetType: input.targetType ?? null,
        targetId: input.targetId ?? null,
        description: input.description,
        metadata: this.sanitizeMetadata(input.metadata),
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      });

      await this.auditLogRepository.save(log);
    } catch (error) {
      console.error('Audit log write failed:', error);
    }
  }

  async findLogs(options: FindAuditLogsOptions = {}): Promise<AuditLog[]> {
    const queryBuilder = this.auditLogRepository.createQueryBuilder('auditLog');

    if (options.action) {
      queryBuilder.andWhere('auditLog.action = :action', { action: options.action });
    }

    if (options.actorId) {
      queryBuilder.andWhere('auditLog.actorId = :actorId', { actorId: options.actorId });
    }

    if (options.targetType) {
      queryBuilder.andWhere('auditLog.targetType = :targetType', {
        targetType: options.targetType,
      });
    }

    if (options.targetId) {
      queryBuilder.andWhere('auditLog.targetId = :targetId', {
        targetId: options.targetId,
      });
    }

    const limit =
      typeof options.limit === 'number' && Number.isFinite(options.limit)
        ? Math.max(1, Math.min(200, Math.floor(options.limit)))
        : 100;

    return queryBuilder
      .orderBy('auditLog.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }
}
