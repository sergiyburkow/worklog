import { ApiProperty } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  telegram?: string;

  @ApiProperty({ required: false })
  whatsapp?: string;

  @ApiProperty({ required: false })
  signal?: string;

  @ApiProperty({ required: false })
  messenger?: string;

  @ApiProperty({ required: false })
  instagram?: string;

  @ApiProperty({ required: false })
  facebook?: string;
} 