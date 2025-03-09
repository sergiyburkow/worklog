import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDateString, IsUUID } from 'class-validator';

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

  @ApiProperty()
  @IsUUID()
  statusId: string;
} 