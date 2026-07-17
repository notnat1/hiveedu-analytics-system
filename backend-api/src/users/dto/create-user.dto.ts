import {
  IsString,
  IsEnum,
  MinLength,
  IsOptional,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { Role } from '../role.enum';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsUUID()
  assignedTutorId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
