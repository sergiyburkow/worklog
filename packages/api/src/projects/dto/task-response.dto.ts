import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  estimatedTime: number;

  @ApiProperty({ required: false })
  complexity?: number;

  @ApiProperty({ required: false })
  tags?: string;

  @ApiProperty({ enum: ['PRODUCT', 'GENERAL'] })
  type: 'PRODUCT' | 'GENERAL';

  @ApiProperty()
  projectId: string;
} 