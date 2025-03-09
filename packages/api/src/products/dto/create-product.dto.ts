import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;
} 