import { ApiProperty } from '@nestjs/swagger';
import { TaskLogStatusResponseDto } from './task-log-status-response.dto';

export class TaskLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  taskId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty()
  timeSpent: number;

  @ApiProperty({ required: false })
  verifiedByUserId?: number;

  @ApiProperty({ type: [TaskLogStatusResponseDto] })
  statusHistory: TaskLogStatusResponseDto[];
} 