import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsDateString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { TaskType } from '@prisma/client';

export class RegisterTaskLogDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productCode?: string;

  @ApiProperty()
  @IsUUID()
  taskId: string;

  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsDateString()
  registeredAt: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  timeSpent?: number;

  @ApiProperty({ enum: TaskType })
  @IsEnum(TaskType)
  type: TaskType;
} 