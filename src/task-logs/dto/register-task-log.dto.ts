import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { TaskType } from '@prisma/client';

export class RegisterTaskLogDto {
  @ApiProperty()
  @IsUUID()
  taskId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty()
  @IsString()
  timeSpent: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  completedAt?: string;
} 