import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterTaskLogDto } from './dto/register-task-log.dto';
import { UpdateTaskLogDto } from './dto/update-task-log.dto';
import { FindTaskLogsDto } from './dto/find-task-logs.dto';
import { TaskLogApprovalStatus, TaskType } from '@prisma/client';
import { UserData } from './types/user-data.type';

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

  async getProjectUserTasksSummary(projectId: string, userId?: string) {
    console.log('getProjectUserTasksSummary called with:', { projectId, userId });

    // Базові умови для where
    const whereCondition = {
      task: {
        projectId,
      },
      ...(userId ? { userId } : {}),
    };

    console.log('Getting task logs with conditions:', whereCondition);

    // Отримуємо всі логи по проекту (або по користувачу в проекті)
    const taskLogs = await this.prisma.taskLog.groupBy({
      by: ['taskId'],
      where: whereCondition,
      _count: {
        taskId: true,
      },
      _sum: {
        timeSpent: true,
      },
    });

    console.log('Task logs found:', taskLogs);

    if (taskLogs.length === 0) {
      return { tasks: [] };
    }

    // Отримуємо деталі задач
    const taskIds = taskLogs.map(log => log.taskId);

    const tasks = await this.prisma.task.findMany({
      where: {
        id: {
          in: taskIds
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        status: true,
        estimatedTime: true,
        complexity: true,
        tags: true,
        projectId: true,
      }
    });

    console.log('Tasks details:', tasks);

    // Якщо вказано userId, отримуємо деталі користувача
    let userData: UserData | null = null;
    if (userId) {
      const projectUser = await this.prisma.projectUser.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              lastName: true,
              callSign: true,
              phone: true,
            }
          }
        }
      });

      if (!projectUser) {
        throw new NotFoundException('User not found in project');
      }

      userData = {
        user: projectUser.user,
        role: projectUser.role,
      };
    }

    // Формуємо відповідь
    const response = {
      ...(userData && { user: userData.user, role: userData.role }),
      tasks: taskLogs.map(log => {
        const task = tasks.find(t => t.id === log.taskId);
        if (!task) {
          console.warn(`Task not found for log:`, log);
          return null;
        }
        return {
          task,
          logsCount: log._count.taskId,
          totalTimeSpent: log._sum.timeSpent || 0,
        };
      }).filter(Boolean)
    };

    console.log('Final response:', response);
    return response;
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

  async getProjectUser(projectId: string, userId: string): Promise<UserData> {
    const projectUser = await this.prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            callSign: true,
            phone: true,
          }
        }
      }
    });

    if (!projectUser) {
      throw new NotFoundException('User not found in project');
    }

    return {
      user: projectUser.user,
      role: projectUser.role,
    };
  }

  async getLogsByTasks(projectId: string, userId?: string) {
    // Базові умови для where
    const whereCondition = {
      task: {
        projectId,
      },
      ...(userId ? { userId } : {}),
    };

    // Отримуємо всі логи по проекту (або по користувачу в проекті)
    const taskLogs = await this.prisma.taskLog.groupBy({
      by: ['taskId'],
      where: whereCondition,
      _count: {
        taskId: true,
      },
      _sum: {
        timeSpent: true,
        quantity: true,
      },
    });

    if (taskLogs.length === 0) {
      return { tasks: [] };
    }

    // Отримуємо деталі задач та їх логи
    const taskIds = taskLogs.map(log => log.taskId);

    const tasks = await this.prisma.task.findMany({
      where: {
        id: {
          in: taskIds
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        status: true,
        estimatedTime: true,
        complexity: true,
        tags: true,
        projectId: true,
        cost: true,
        logs: {
          where: userId ? { userId } : undefined,
          select: {
            cost: true,
            quantity: true,
            timeSpent: true,
          }
        }
      }
    });

    return {
      tasks: taskLogs.map(log => {
        const task = tasks.find(t => t.id === log.taskId);
        if (!task) {
          console.warn(`Task not found for log:`, log);
          return null;
        }

        let totalCost = 0;
        switch (task.type) {
          case TaskType.PRODUCT:
            totalCost = task.logs.reduce((sum, log) => sum + Number(log.cost || 0), 0);
            break;
          case TaskType.INTERMEDIATE:
            totalCost = task.logs.reduce((sum, log) => sum + (Number(log.cost || 0) * (log.quantity || 0)), 0);
            break;
          case TaskType.GENERAL:
            totalCost = task.logs.reduce((sum, log) => sum + (Number(log.cost || 0) * Number(log.timeSpent || 0)), 0);
            break;
        }

        return {
          task,
          logsCount: log._count.taskId,
          totalTimeSpent: log._sum.timeSpent || 0,
          quantity: task.type === TaskType.INTERMEDIATE ? (log._sum.quantity || 0) : undefined,
          totalCost,
        };
      }).filter(Boolean)
    };
  }

  async getUserLogsByDays(projectId: string, userId: string) {
    const logs = await this.prisma.taskLog.findMany({
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
        registeredAt: 'desc',
      },
    });

    return { logs };
  }
} 