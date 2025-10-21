import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  deadline: Date;

  @ApiProperty({ required: false })
  actualEndDate?: Date;

  @ApiProperty()
  status: ProjectStatus;

  @ApiProperty({ required: false })
  quantity?: number;

  @ApiProperty()
  client: {
    id: string;
    name: string;
  };

  @ApiProperty({ type: [Object] })
  users: Array<{
    userId: string;
    role: string;
    user: {
      id: string;
      name: string;
      lastName: string | null;
      callSign: string | null;
      email: string;
      phone: string | null;
    };
  }>;
} 