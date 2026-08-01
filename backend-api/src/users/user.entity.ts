import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.enum.js';
import { RecordEntity } from '../records/record.entity.js';
import { Attendance } from '../attendance/attendance.entity.js';
import { InterventionNote } from '../interventions/intervention-note.entity.js';

/**
 * User Entity
 * -------------------------------------------------
 * Represents any platform participant in the HiveEdu E-Raport system.
 *
 * RBAC roles:
 *   - ADMIN   â†’ Data entry operator
 *   - TEACHER â†’ Objective inputs and assessments
 *   - USER    â†’ USER role account (views predictions & reports)
 *
 * IMPORTANT: The term "user" refers to the USER role account throughout
 * the entire codebase â€” keep USER role wording consistent.
 */
@Entity('users')
export class User {
  /** Primary key â€” auto-generated UUID */
  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  /** Full name of the user */
  @Column({ type: 'varchar', length: 255 })
  fullName!: string;

  /** Unique username for login */
  @Column({ type: 'varchar', length: 255, unique: true })
  username!: string;

  /** Hashed password */
  @Column({ type: 'varchar', length: 255 })
  password!: string;

  /**
   * Role assigned to this user for RBAC.
   * Defaults to USER (USER role account) if not specified.
   */
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role!: Role;

  /** Whether the account is currently active */
  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isTwoFactorEnabled!: boolean;

  @Column({ nullable: true })
  twoFactorSecret!: string;

  /** Indicates if the user has acknowledged an early warning alert */
  @Column({ type: 'boolean', default: false })
  warningAcknowledged!: boolean;

  /** Academic records associated with this user */
  @OneToMany(() => RecordEntity, (record) => record.user)
  records!: RecordEntity[];

  /** Attendance records associated with this user */
  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances!: Attendance[];

  /** Intervention notes associated with this user */
  @OneToMany(() => InterventionNote, (note) => note.user)
  interventionNotes!: InterventionNote[];

  /** Intervention notes created by this user (if ADMIN/TEACHER) */
  @OneToMany(() => InterventionNote, (note) => note.createdBy)
  createdInterventions!: InterventionNote[];

  /** Assigned tutor reference for a user account */
  @ManyToOne(() => User, (user) => user.assignedUsers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assignedTutorId' })
  assignedTutor!: User | null;

  /** Optional assigned tutor identifier */
  @Column({ type: 'uuid', nullable: true })
  assignedTutorId!: string | null;

  /** User accounts assigned to this tutor */
  @OneToMany(() => User, (user) => user.assignedTutor)
  assignedUsers!: User[];

  /** Timestamp of record creation */
  @CreateDateColumn()
  createdAt!: Date;

  /** Timestamp of last update */
  @UpdateDateColumn()
  updatedAt!: Date;
}
