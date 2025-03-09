import { ApiProperty } from '@nestjs/swagger';

export class ProductTaskResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  typeId: number;

  @ApiProperty({ required: false })
  tags?: string;

  @ApiProperty({ required: false })
  complexity?: number;

  @ApiProperty({ required: false })
  estimatedTime?: number;

  @ApiProperty()
  updatedAt: Date;
} 