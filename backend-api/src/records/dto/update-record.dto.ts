import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRecordDto {
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

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  englishScore?: number;

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
