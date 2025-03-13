import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class UpdateTaskLogDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productCode?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  registeredAt?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  timeSpent?: number;
} 