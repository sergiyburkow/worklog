import { ApiProperty } from '@nestjs/swagger';

export class ProjectTaskResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  typeId: number;

  @ApiProperty({ required: false })
  tags?: string;

  @ApiProperty({ required: false })
  complexity?: number;

  @ApiProperty({ required: false })
  trackedTime?: number;

  @ApiProperty()
  updatedAt: Date;
} 