import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { TaskLogApprovalStatus } from '@prisma/client';
import { CheckProductResponseDto } from './dto/check-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        taskLogs: {
          include: {
            statusHistory: true,
            task: true,
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
            task: true,
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
            task: true,
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
            task: true,
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

  async checkProductInProject(productCode: string, projectId: string, taskId?: string): Promise<CheckProductResponseDto> {
    // Перевіряємо чи існує продукт за кодом
    const product = await this.prisma.product.findFirst({
      where: {
        code: productCode,
        projectId: projectId,
      },
    });

    if (!product) {
      return {
        status: 'NOT_EXISTS'
      };
    }

    // Якщо вказано taskId, перевіряємо чи немає вже такої комбінації продукт-задача
    if (taskId) {
      const existingTaskLog = await this.prisma.taskLog.findFirst({
        where: {
          productId: product.id,
          taskId: taskId,
        },
      });

      if (existingTaskLog) {
        return {
          status: 'ERROR'
        };
      }
    }

    return {
      status: 'EXISTS'
    };
  }

  async findByCode(projectId: string, code: string) {
    return this.prisma.product.findFirst({
      where: {
        projectId,
        code,
      },
    });
  }
} 