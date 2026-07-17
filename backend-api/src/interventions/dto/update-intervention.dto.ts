import { IsOptional, IsString, IsEnum } from 'class-validator';
import { InterventionStatus } from '../intervention-status.enum.js';

export class UpdateInterventionDto {
  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  actionPlan?: string;

  @IsOptional()
  @IsEnum(InterventionStatus)
  status?: InterventionStatus;
}
