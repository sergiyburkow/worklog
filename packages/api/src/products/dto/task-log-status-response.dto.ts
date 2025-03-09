import { ApiProperty } from '@nestjs/swagger';

export class TaskLogStatusResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  taskLogId: number;

  @ApiProperty()
  statusId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;
} 