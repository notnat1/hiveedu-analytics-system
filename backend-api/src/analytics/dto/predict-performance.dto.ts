import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class PredictPerformanceDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  attendancePercentage!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  avgTryoutScore!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  teacherObjectiveScore?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  tryoutCount!: number;
}
