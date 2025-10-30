import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsInt, Min } from 'class-validator'

export class CreatePartGroupDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number
}
