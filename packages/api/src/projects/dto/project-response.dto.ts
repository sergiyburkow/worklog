import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  clientId: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  deadline: Date;

  @ApiProperty({ required: false })
  actualEndDate?: Date;

  @ApiProperty()
  statusId: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [Number] })
  userIds: number[];
} 