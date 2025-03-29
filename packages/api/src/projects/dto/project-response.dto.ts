import { ApiProperty } from '@nestjs/swagger';
import { ProjectUserResponseDto } from './project-user-response.dto';

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
  status: string;

  @ApiProperty({ required: false })
  quantity?: number;

  @ApiProperty()
  client: {
    id: string;
    name: string;
  };

  @ApiProperty({ type: [ProjectUserResponseDto] })
  users: ProjectUserResponseDto[];
} 