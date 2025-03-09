import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsArray, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  clientId: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  deadline: string;

  @ApiProperty()
  @IsUUID()
  statusId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  userIds: string[];
} 