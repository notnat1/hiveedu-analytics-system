import { IsDateString, IsEnum, IsUUID } from 'class-validator';
import { AttendanceStatus } from '../attendance-status.enum.js';

export class CreateAttendanceDto {
  @IsUUID()
  userId!: string;

  @IsDateString()
  date!: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;
}
