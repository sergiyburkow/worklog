import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto, CreateContactDto } from './dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.findMany({
      include: {
        contacts: true,
      },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        contacts: true,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async create(createClientDto: CreateClientDto) {
    return this.prisma.client.create({
      data: createClientDto,
      include: {
        contacts: true,
      },
    });
  }

  async update(id: string, updateClientDto: CreateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
      include: {
        contacts: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.client.delete({
      where: { id },
    });
  }

  async addContact(clientId: string, createContactDto: CreateContactDto) {
    return this.prisma.clientContact.create({
      data: {
        ...createContactDto,
        clientId,
      },
    });
  }

  async updateContact(contactId: string, updateContactDto: CreateContactDto) {
    return this.prisma.clientContact.update({
      where: { id: contactId },
      data: updateContactDto,
    });
  }

  async removeContact(contactId: string) {
    await this.prisma.clientContact.delete({
      where: { id: contactId },
    });
  }
} 