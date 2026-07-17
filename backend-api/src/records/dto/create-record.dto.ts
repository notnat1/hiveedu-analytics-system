import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecordDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  mathScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  logicScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  mathematicsScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  logicalReasoningScore?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  englishScore!: number;

  @IsOptional()
  @IsNumber()
  averageScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  teacherObjectiveScore?: number;

  @IsOptional()
  @IsString()
  teacherFeedback?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  actualExamScore?: number;

  @IsOptional()
  @IsDateString()
  examDate?: string;

  @IsOptional()
  @IsString()
  examLabel?: string;

  @IsOptional()
  @IsBoolean()
  isUsedForTraining?: boolean;
}
