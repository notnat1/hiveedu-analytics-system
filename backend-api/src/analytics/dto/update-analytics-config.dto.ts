import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { CoefficientMode } from '../coefficient-mode.enum.js';

export class UpdateAnalyticsConfigDto {
  @IsOptional()
  @IsNumber()
  intercept?: number;

  @IsOptional()
  @IsNumber()
  attendanceCoefficient?: number;

  @IsOptional()
  @IsNumber()
  tryoutCoefficient?: number;

  @IsOptional()
  @IsNumber()
  teacherObjectiveCoefficient?: number;

  @IsOptional()
  @IsEnum(CoefficientMode)
  coefficientMode?: CoefficientMode;

  @IsOptional()
  @IsNumber()
  @Min(0)
  x1Weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  x2Weight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  x3Weight?: number;
}
