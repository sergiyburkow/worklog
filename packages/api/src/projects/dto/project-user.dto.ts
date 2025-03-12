import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ProjectUserRole } from '@prisma/client';

export class ProjectUserDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: ProjectUserRole })
  @IsEnum(ProjectUserRole)
  role: ProjectUserRole;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 