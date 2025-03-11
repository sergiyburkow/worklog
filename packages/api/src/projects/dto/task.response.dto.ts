import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  estimatedTime: string;

  @ApiProperty()
  type: 'PRODUCT' | 'GENERAL';

  @ApiProperty()
  projectId: string;

  @ApiProperty({ required: false })
  complexity?: number;
} 