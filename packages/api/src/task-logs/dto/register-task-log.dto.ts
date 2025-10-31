import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsDateString, IsOptional, IsNumber, IsEnum, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskType } from '@prisma/client';

export class RegisterTaskLogDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productCode?: string;

  @ApiProperty()
  @IsUUID()
  taskId: string;

  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsDateString()
  registeredAt: string;

  @ApiProperty({ required: false, description: 'Deprecated: береться з JWT' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  timeSpent?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  partId?: string;

  @ApiProperty({ required: false, type: () => [ConsumedPartDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsumedPartDto)
  consumedParts?: ConsumedPartDto[];

  @ApiProperty({ enum: TaskType })
  @IsEnum(TaskType)
  type: TaskType;
} 

export class ConsumedPartDto {
  @ApiProperty()
  @IsUUID()
  partId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.000001)
  quantity!: number;
}