import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterTaskLogDto } from './dto/register-task-log.dto';
import { UpdateTaskLogDto } from './dto/update-task-log.dto';
import { FindTaskLogsDto } from './dto/find-task-logs.dto';
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

        // Перевіряємо чи існує вже реєстрація для цього продукту і задачі
        const existingTaskLog = await this.prisma.taskLog.findFirst({
          where: {
            taskId: registerTaskLogDto.taskId,
            productId: product.id,
          },
          include: {
            task: true,
            product: true,
          },
        });

        if (existingTaskLog) {
          throw new BadRequestException(
            `Задача "${existingTaskLog.task.name}" вже зареєстрована для продукту з кодом ${existingTaskLog.product?.code || 'невідомий'}`
          );
        }
      }
    }

    // Створюємо запис про виконання задачі
    const registeredDate = new Date(registerTaskLogDto.registeredAt);

    const taskLog = await this.prisma.taskLog.create({
      data: {
        userId: registerTaskLogDto.userId,
        taskId: registerTaskLogDto.taskId,
        productId: productId,
        timeSpent: registerTaskLogDto.timeSpent,
        quantity: registerTaskLogDto.quantity,
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

  async findByProject(projectId: string, filters?: FindTaskLogsDto) {
    const where = {
      AND: [
        {
          task: {
            projectId
          }
        },
        ...(filters?.productId ? [{
          productId: filters.productId
        }] : []),
        ...(filters?.registeredFrom ? [{
          registeredAt: {
            gte: new Date(filters.registeredFrom)
          }
        }] : []),
        ...(filters?.registeredTo ? [{
          registeredAt: {
            lte: new Date(filters.registeredTo)
          }
        }] : [])
      ]
    };

    return this.prisma.taskLog.findMany({
      where,
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
        registeredAt: 'desc',
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

  async remove(id: string) {
    const taskLog = await this.prisma.taskLog.findUnique({
      where: { id },
    });

    if (!taskLog) {
      throw new NotFoundException(`Task log with ID ${id} not found`);
    }

    await this.prisma.taskLog.delete({
      where: { id },
    });
  }

  async update(id: string, updateTaskLogDto: UpdateTaskLogDto) {
    const taskLog = await this.prisma.taskLog.findUnique({
      where: { id },
      include: {
        task: true,
      },
    });

    if (!taskLog) {
      throw new NotFoundException(`Task log with ID ${id} not found`);
    }

    let productId: string | undefined;

    if (updateTaskLogDto.productCode && taskLog.task.type === TaskType.PRODUCT) {
      const product = await this.prisma.product.findFirst({
        where: {
          code: updateTaskLogDto.productCode,
          projectId: taskLog.task.projectId,
        },
      });

      if (!product) {
        const newProduct = await this.prisma.product.create({
          data: {
            code: updateTaskLogDto.productCode,
            projectId: taskLog.task.projectId,
          },
        });
        productId = newProduct.id;
      } else {
        productId = product.id;
      }
    }

    return this.prisma.taskLog.update({
      where: { id },
      data: {
        ...(productId && { productId }),
        ...(updateTaskLogDto.registeredAt && { registeredAt: new Date(updateTaskLogDto.registeredAt) }),
        ...(updateTaskLogDto.timeSpent && { timeSpent: updateTaskLogDto.timeSpent }),
        ...(updateTaskLogDto.quantity !== undefined && { quantity: updateTaskLogDto.quantity }),
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
  }
} 