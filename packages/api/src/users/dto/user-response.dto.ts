import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  lastName?: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  callSign?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 