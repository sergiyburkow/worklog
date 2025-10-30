import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum InventoryLogType {
  PURCHASE = 'PURCHASE',
  PRODUCTION = 'PRODUCTION',
  ADJUSTMENT = 'ADJUSTMENT',
}

export class CreateInventoryLogDto {
  @ApiProperty({ enum: InventoryLogType })
  @IsEnum(InventoryLogType)
  type: InventoryLogType;

  @ApiProperty()
  @IsNumber()
  @Min(0.000001)
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  taskLogId?: string;
}
