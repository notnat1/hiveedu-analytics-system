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
 * AnalyticsRecord Entity
 * -------------------------------------------------
 * Stores feature inputs and predicted/actual
 * performance scores for a specific user in the HiveEdu E-Raport
 * Multiple Linear Regression model.
 *
 * Final regression model: Y = a + b1X1 + b2X2 + b3X3.
 *
 * Where:
 *   X1 = attendancePercentage (0-100)
 *   X2 = avgTryoutScore (0-100)
 *   X3 = teacherObjectiveScore (0-100)
 *   Y  = predictedScore (0-100)
 *
 * MSE validation uses rows with both predictedScore and actualExamScore.
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase - keep USER role wording consistent.
 */
@Entity('analytics_records')
export class AnalyticsRecord {
  /** Primary key â€” auto-generated UUID */
  @PrimaryGeneratedColumn('uuid')
  analyticsId!: string;

  // ---------------------------------------------------------------
  // Relationship: Each analytics record belongs to one user
  // ---------------------------------------------------------------

  /**
   * The user this analytics record belongs to.
   * ManyToOne: many records can reference a single user.
   */
  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  /** Foreign key column for the associated user UUID */
  @Column({ type: 'uuid' })
  userId!: string;

  // ---------------------------------------------------------------
  // Feature inputs (X1, X2, X3) for the final MLR model.
  // ---------------------------------------------------------------

  /**
   * X1 - attendance percentage, range 0-100.
   */
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  attendancePercentage!: number;

  /**
   * X2 - average tryout history score, range 0-100.
   */
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  avgTryoutScore!: number;

  /**
   * X3 - teacher objective score, range 0-100.
   * Business weight baseline: 10%
   */
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  teacherObjectiveScore!: number;

  // ---------------------------------------------------------------
  // Tryout Count â€” enforces the minimum-5-tryouts business rule
  // ---------------------------------------------------------------

  /**
   * Number of tryouts the user has completed.
   * Business rule: A minimum of 5 complete tryout histories is required before
   * a prediction can be generated.
   */
  @Column({ type: 'int', default: 0 })
  tryoutCount!: number;

  // ---------------------------------------------------------------
  // Output (Y) â€” Predicted & Actual Scores
  // ---------------------------------------------------------------

  /**
   * Y - predicted next exam score.
   * Computed by the final MLR model: Y = a + b1X1 + b2X2 + b3X3.
   * Nullable initially; set after prediction is run.
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  predictedScore!: number | null;

  /**
   * Actual exam score recorded after the real exam takes place.
   * Used later to compute Mean Squared Error (MSE) for model validation.
   * Nullable â€” only populated when the actual result is available.
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  actualExamScore!: number | null;

  // ---------------------------------------------------------------
  // Audit timestamps
  // ---------------------------------------------------------------

  /** Timestamp of record creation */
  @CreateDateColumn()
  createdAt!: Date;

  /** Timestamp of last update */
  @UpdateDateColumn()
  updatedAt!: Date;
}
