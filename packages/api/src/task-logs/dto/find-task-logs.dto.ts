import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { TaskType } from '@prisma/client';

export class FindTaskLogsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({ required: false, enum: TaskType })
  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  registeredFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  registeredTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  completedFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  completedTo?: string;
} 