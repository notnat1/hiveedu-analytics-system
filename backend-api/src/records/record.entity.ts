import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';

/**
 * RecordEntity
 * -------------------------------------------------
 * Stores per-subject academic inputs and optional
 * teacher feedback for a specific user.
 *
 * NOTE: The term "user" refers to the USER role
 * throughout the codebase.
 */
@Entity('records')
export class RecordEntity {
  @PrimaryGeneratedColumn('uuid')
  recordId!: string;

  @ManyToOne(() => User, (user) => user.records, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'float', nullable: true })
  mathScore!: number | null;

  @Column({ type: 'float', nullable: true })
  logicScore!: number | null;

  @Column({ type: 'float' })
  mathematicsScore!: number;

  @Column({ type: 'float' })
  logicalReasoningScore!: number;

  @Column({ type: 'float' })
  englishScore!: number;

  @Column({ type: 'float', nullable: true })
  averageScore!: number | null;

  @Column({ type: 'float', nullable: true })
  teacherObjectiveScore!: number | null;

  @Column({ type: 'text', nullable: true })
  teacherFeedback!: string | null;

  @Column({ type: 'float', nullable: true })
  actualExamScore!: number | null;

  @Column({ type: 'date', nullable: true })
  examDate!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  examLabel!: string | null;

  @Column({ type: 'boolean', default: true })
  isUsedForTraining!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
