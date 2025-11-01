import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';

export class CreateTaskGroupDto {
  @ApiProperty({
    description: 'Назва групи задач',
    example: 'Фасадні роботи',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    description: 'Опис групи задач (опціонально)',
    example: 'Всі задачі, пов\'язані з фасадними роботами',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Порядок сортування для відображення (менше значення = вище в списку)',
    example: 0,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}

