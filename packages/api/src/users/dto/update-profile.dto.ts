import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  callSign?: string;

  @IsString()
  @IsOptional()
  currentPassword?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  newPassword?: string;
} 