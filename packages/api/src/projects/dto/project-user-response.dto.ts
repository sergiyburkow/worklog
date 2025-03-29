import { ApiProperty } from '@nestjs/swagger';

export class ProjectUserResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  user: {
    id: string;
    name: string;
    lastName: string | null;
    callSign: string | null;
    email: string;
  };
} 