import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTaskTypeDto {
  @ApiProperty()
  @IsString()
  name: string;
} 