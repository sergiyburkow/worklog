import { ApiProperty } from '@nestjs/swagger';

export class TaskTypeResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
} 