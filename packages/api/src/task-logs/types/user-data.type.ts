import { ApiProperty } from '@nestjs/swagger';

export class UserDataResponse {
  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John',
      phone: '+380991234567',
      callSign: 'Eagle',
      lastName: 'Doe'
    }
  })
  user: {
    id: string;
    name: string;
    phone: string | null;
    callSign: string | null;
    lastName: string | null;
  };

  @ApiProperty({
    example: 'ENGINEER',
    description: 'User role in the project'
  })
  role: string;
}

export interface UserData {
  user: {
    id: string;
    name: string;
    phone: string | null;
    callSign: string | null;
    lastName: string | null;
  };
  role: string;
} 