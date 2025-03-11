import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { TaskLogApprovalStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        taskLogs: {
          include: {
            statusHistory: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        taskLogs: {
          include: {
            statusHistory: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByProject(projectId: string) {
    return this.prisma.product.findMany({
      where: { projectId },
      include: {
        taskLogs: {
          include: {
            statusHistory: true,
          },
        },
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        code: createProductDto.code,
        projectId: createProductDto.projectId,
      },
      include: {
        taskLogs: {
          include: {
            statusHistory: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.prisma.product.delete({
      where: { id },
    });
  }

} 