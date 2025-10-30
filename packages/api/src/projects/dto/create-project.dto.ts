import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
import { IsString, IsDateString, IsArray, IsUUID, IsEnum, IsOptional, IsInt, Min, Length, Matches } from 'class-validator';
import { ProjectUserDto } from './project-user.dto';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  clientId: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  deadline: string;

  @ApiProperty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiProperty({ type: [ProjectUserDto] })
  @IsArray()
  projectUsers: ProjectUserDto[];

  @ApiProperty({ required: false, description: '3 chars: A-Z or 0-9, uppercased on save' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z0-9]{3}$/)
  projectCode?: string;
} 