import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString } from 'class-validator';

export class CreateProjectPaymentDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDateString()
  date: string;
} 