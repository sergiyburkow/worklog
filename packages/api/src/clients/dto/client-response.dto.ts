import { ApiProperty } from '@nestjs/swagger';
import { ContactResponseDto } from './contact-response.dto';

export class ClientResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  contactInfo?: string;

  @ApiProperty({ type: [ContactResponseDto] })
  contacts: ContactResponseDto[];
} 