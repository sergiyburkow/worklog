import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
import { IsString, IsDateString, IsArray, IsUUID, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
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
} 