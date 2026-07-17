import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoefficientMode } from './coefficient-mode.enum.js';

@Entity('system_config')
export class SystemConfig {
  @PrimaryGeneratedColumn('uuid')
  configId!: string;

  @Column({ type: 'float', default: 0 })
  intercept!: number;

  @Column({ type: 'float', default: 0.4 })
  attendanceCoefficient!: number;

  @Column({ type: 'float', default: 0.5 })
  tryoutCoefficient!: number;

  @Column({ type: 'float', default: 0.1 })
  teacherObjectiveCoefficient!: number;

  @Column({
    type: 'enum',
    enum: CoefficientMode,
    default: CoefficientMode.AUTO_TRAINED,
  })
  coefficientMode!: CoefficientMode;

  @Column({ type: 'float', default: 40 })
  x1Weight!: number;

  @Column({ type: 'float', default: 50 })
  x2Weight!: number;

  @Column({ type: 'float', default: 10 })
  x3Weight!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
