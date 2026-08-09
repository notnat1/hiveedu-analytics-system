import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  logId!: string;

  @Column({ type: 'varchar', length: 80 })
  action!: string;

  @Column({ type: 'uuid', nullable: true })
  actorId!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  actorRole!: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  targetType!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  targetId!: string | null;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ipAddress!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
