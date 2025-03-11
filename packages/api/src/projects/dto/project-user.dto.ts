import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum } from 'class-validator';

export enum ProjectRole {
  MANAGER = 'MANAGER',
  QA = 'QA',
  ENGINEER = 'ENGINEER',
  PADAWAN = 'PADAWAN',
}

export class ProjectUserDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ enum: ProjectRole })
  @IsEnum(ProjectRole)
  role: ProjectRole;
} 