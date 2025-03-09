import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateContactDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  telegram?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  signal?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  messenger?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  instagram?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  facebook?: string;
} 