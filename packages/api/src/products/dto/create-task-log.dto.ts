import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { TaskLogApprovalStatus } from '@prisma/client';

export class CreateTaskLogDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  taskId: string;

  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsDateString()
  completedAt: string;

  @ApiProperty()
  @IsNumber()
  timeSpent: number;

  @ApiProperty({ enum: TaskLogApprovalStatus })
  @IsEnum(TaskLogApprovalStatus)
  status: TaskLogApprovalStatus;
} 