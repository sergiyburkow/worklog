import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AnonymousLoginDto {
  @ApiProperty({ example: 'maestro' })
  @IsString()
  @MinLength(3)
  nickname: string;
} 