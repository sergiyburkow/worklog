import { ApiProperty } from '@nestjs/swagger';

export class ProjectPaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  user: {
    id: string;
    name: string;
    lastName: string | null;
    callSign: string | null;
  };

  @ApiProperty()
  createdBy: {
    id: string;
    name: string;
    lastName: string | null;
    callSign: string | null;
  };
} 