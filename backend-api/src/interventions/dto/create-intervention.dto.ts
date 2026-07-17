import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { InterventionStatus } from '../intervention-status.enum.js';

export class CreateInterventionDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  riskLevel!: string;

  @IsNumber()
  @IsOptional()
  predictedScore?: number;

  @IsString()
  @IsNotEmpty()
  note!: string;

  @IsString()
  @IsOptional()
  actionPlan?: string;

  @IsEnum(InterventionStatus)
  @IsOptional()
  status?: InterventionStatus;
}
