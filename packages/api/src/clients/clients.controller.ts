import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientResponseDto, CreateClientDto, CreateContactDto, ContactResponseDto } from './dto';

@ApiTags('clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'Return all clients', type: [ClientResponseDto] })
  async findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by id' })
  @ApiResponse({ status: 200, description: 'Return client by id', type: ClientResponseDto })
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create client' })
  @ApiResponse({ status: 201, description: 'Client has been created', type: ClientResponseDto })
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({ status: 200, description: 'Client has been updated', type: ClientResponseDto })
  async update(@Param('id') id: string, @Body() updateClientDto: CreateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  @ApiResponse({ status: 200, description: 'Client has been deleted' })
  async remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }

  @Post(':id/contacts')
  @ApiOperation({ summary: 'Add contact to client' })
  @ApiResponse({ status: 201, description: 'Contact has been added to client', type: ContactResponseDto })
  async addContact(
    @Param('id') id: string,
    @Body() createContactDto: CreateContactDto,
  ) {
    return this.clientsService.addContact(id, createContactDto);
  }

  @Put('contacts/:id')
  @ApiOperation({ summary: 'Update contact' })
  @ApiResponse({ status: 200, description: 'Contact has been updated', type: ContactResponseDto })
  async updateContact(
    @Param('id') id: string,
    @Body() updateContactDto: CreateContactDto,
  ) {
    return this.clientsService.updateContact(id, updateContactDto);
  }

  @Delete('contacts/:id')
  @ApiOperation({ summary: 'Delete contact' })
  @ApiResponse({ status: 200, description: 'Contact has been deleted' })
  async removeContact(@Param('id') id: string) {
    return this.clientsService.removeContact(id);
  }
} 