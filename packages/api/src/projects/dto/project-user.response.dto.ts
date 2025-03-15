import { ApiProperty } from '@nestjs/swagger';

export class ProjectUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
} 