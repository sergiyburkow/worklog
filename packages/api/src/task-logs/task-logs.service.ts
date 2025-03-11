import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterTaskLogDto } from './dto/register-task-log.dto';
import { TaskLogApprovalStatus, TaskType } from '@prisma/client';

@Injectable()
export class TaskLogsService {
  constructor(private prisma: PrismaService) {}

  async register(registerTaskLogDto: RegisterTaskLogDto) {
    let productId: string | undefined;

    // Якщо це продуктова задача, знаходимо або створюємо продукт
    if (registerTaskLogDto.type === TaskType.PRODUCT) {
      if (!registerTaskLogDto.productCode) {
        throw new Error('Product code is required for product tasks');
      }

      const product = await this.prisma.product.findFirst({
        where: {
          code: registerTaskLogDto.productCode,
          projectId: registerTaskLogDto.projectId,
        },
      });

      if (!product) {
        const newProduct = await this.prisma.product.create({
          data: {
            code: registerTaskLogDto.productCode,
            projectId: registerTaskLogDto.projectId,
          },
        });
        productId = newProduct.id;
      } else {
        productId = product.id;
      }
    }

    // Створюємо запис про виконання задачі
    console.log('Received registeredAt:', registerTaskLogDto.registeredAt);
    const registeredDate = new Date(registerTaskLogDto.registeredAt);
    console.log('Parsed date:', registeredDate);

    const taskLog = await this.prisma.taskLog.create({
      data: {
        userId: registerTaskLogDto.userId,
        taskId: registerTaskLogDto.taskId,
        productId: productId,
        timeSpent: registerTaskLogDto.timeSpent,
        registeredAt: registeredDate,
      },
      include: {
        user: true,
        task: true,
        product: true,
        statusHistory: {
          include: {
            user: true,
          },
        },
      },
    });

    return taskLog;
  }

  async findByProject(projectId: string) {
    return this.prisma.taskLog.findMany({
      where: {
        task: {
          projectId,
        },
      },
      include: {
        user: true,
        task: true,
        product: true,
        statusHistory: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });
  }

  async findByProjectAndUser(projectId: string, userId: string) {
    return this.prisma.taskLog.findMany({
      where: {
        userId,
        task: {
          projectId,
        },
      },
      include: {
        user: true,
        task: true,
        product: true,
        statusHistory: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        completedAt: 'desc',
      },
    });
  }
} 