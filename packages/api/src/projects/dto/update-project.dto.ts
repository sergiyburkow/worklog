import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsArray, IsOptional, IsUUID, IsEnum, IsInt, Min, Length, Matches } from 'class-validator';
import { ProjectStatus } from '@prisma/client';
import { ProjectUserDto } from './project-user.dto';

export class UpdateProjectDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  actualEndDate?: string;

  @ApiProperty({ required: false })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiProperty({ type: [ProjectUserDto], required: false })
  @IsArray()
  @IsOptional()
  projectUsers?: ProjectUserDto[];

  @ApiProperty({ required: false, description: '3 chars: A-Z or 0-9, uppercased on save' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z0-9]{3}$/)
  projectCode?: string;
} 