import { ApiProperty } from '@nestjs/swagger';
import { TaskLogResponseDto } from './task-log-response.dto';

export class ProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [TaskLogResponseDto] })
  taskLogs: TaskLogResponseDto[];
} 