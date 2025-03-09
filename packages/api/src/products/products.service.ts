import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, CreateTaskLogDto } from './dto';

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
      data: createProductDto,
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

  // Task Logs
  async findAllTaskLogs() {
    return this.prisma.productTaskLog.findMany({
      include: {
        statusHistory: true,
      },
    });
  }

  async findTaskLogById(id: string) {
    const taskLog = await this.prisma.productTaskLog.findUnique({
      where: { id },
      include: {
        statusHistory: true,
      },
    });

    if (!taskLog) {
      throw new NotFoundException(`Task log with ID ${id} not found`);
    }

    return taskLog;
  }

  async findTaskLogsByProduct(productId: string) {
    return this.prisma.productTaskLog.findMany({
      where: { productId },
      include: {
        statusHistory: true,
      },
    });
  }

  async createTaskLog(createTaskLogDto: CreateTaskLogDto) {
    const { statusId, ...taskLogData } = createTaskLogDto;

    return this.prisma.productTaskLog.create({
      data: {
        ...taskLogData,
        statusHistory: {
          create: {
            statusId,
            userId: taskLogData.userId,
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });
  }

  async verifyTaskLog(id: string, verifiedByUserId: string) {
    return this.prisma.productTaskLog.update({
      where: { id },
      data: {
        verifiedByUserId,
      },
      include: {
        statusHistory: true,
      },
    });
  }

  async updateTaskLogStatus(id: string, statusId: string, userId: string) {
    const taskLog = await this.prisma.productTaskLog.findUnique({
      where: { id },
      include: {
        statusHistory: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!taskLog) {
      throw new NotFoundException(`Task log with ID ${id} not found`);
    }

    // Only create new status if it's different from the current one
    if (taskLog.statusHistory[0]?.statusId !== statusId) {
      await this.prisma.taskLogStatusHistory.create({
        data: {
          taskLogId: id,
          statusId,
          userId,
        },
      });
    }

    return this.findTaskLogById(id);
  }
} 