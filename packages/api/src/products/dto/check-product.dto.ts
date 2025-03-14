import { ApiProperty } from '@nestjs/swagger';

export class CheckProductResponseDto {
  @ApiProperty({ description: 'Статус перевірки продукту' })
  status: 'EXISTS' | 'NOT_EXISTS' | 'ERROR';
} 