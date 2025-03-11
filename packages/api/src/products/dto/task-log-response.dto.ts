import { ApiProperty } from '@nestjs/swagger';
import { TaskLogStatusResponseDto } from './task-log-status-response.dto';

export class TaskLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  taskId: string;

  @ApiProperty({ required: false })
  productId?: string;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty({ required: false })
  timeSpent?: number;

  @ApiProperty({ type: [TaskLogStatusResponseDto] })
  statusHistory: TaskLogStatusResponseDto[];
} 