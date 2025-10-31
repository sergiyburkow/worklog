import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskType } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ enum: TaskType })
  @IsEnum(TaskType)
  type: TaskType;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  complexity?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  estimatedTime?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'cost must be a number' })
  @Min(0)
  cost?: number;
} 