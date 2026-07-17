import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';
import { CoefficientMode } from './coefficient-mode.enum.js';

@Entity('mlr_run_history')
export class MlrRunHistory {
  @PrimaryGeneratedColumn('uuid')
  historyId!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt!: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'generatedById' })
  generatedBy!: User | null;

  @Column({ type: 'uuid', nullable: true })
  generatedById!: string | null;

  @Column({
    type: 'enum',
    enum: CoefficientMode,
  })
  coefficientMode!: CoefficientMode;

  @Column({ type: 'float' })
  intercept!: number;

  @Column({ type: 'float' })
  attendanceCoefficient!: number;

  @Column({ type: 'float' })
  tryoutCoefficient!: number;

  @Column({ type: 'float', default: 0.1 })
  teacherObjectiveCoefficient!: number;

  @Column({ type: 'float', nullable: true })
  mse!: number | null;

  @Column({ type: 'int' })
  totalUserCount!: number;

  @Column({ type: 'int' })
  activeUserCount!: number;

  @Column({ type: 'int' })
  eligibleUserCount!: number;

  @Column({ type: 'int' })
  excludedUserCount!: number;

  @Column({ type: 'int' })
  excludedInactiveCount!: number;

  @Column({ type: 'int' })
  excludedInsufficientTryoutCount!: number;

  @Column({ type: 'int' })
  excludedNullScoreCount!: number;

  @Column({ type: 'int' })
  trainingSampleCount!: number;

  @Column({ type: 'int' })
  predictionCount!: number;

  @Column({ type: 'boolean', default: false })
  fallbackUsed!: boolean;

  @Column({ type: 'text', nullable: true })
  fallbackReason!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
