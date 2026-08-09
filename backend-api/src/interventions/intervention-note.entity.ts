import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';
import { InterventionStatus } from './intervention-status.enum.js';

@Entity('intervention_notes')
export class InterventionNote {
  @PrimaryGeneratedColumn('uuid')
  noteId!: string;

  @ManyToOne(() => User, (user) => user.interventionNotes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.createdInterventions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User | null;

  @Column({ type: 'uuid', nullable: true })
  createdById!: string | null;

  @Column({ type: 'varchar', length: 20 })
  riskLevel!: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  predictedScore!: number | null;

  @Column({ type: 'text' })
  note!: string;

  @Column({ type: 'text', nullable: true })
  actionPlan!: string | null;

  @Column({
    type: 'enum',
    enum: InterventionStatus,
    default: InterventionStatus.OPEN,
  })
  status!: InterventionStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
