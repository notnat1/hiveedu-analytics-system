import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSelfProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
