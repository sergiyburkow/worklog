import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RegisterTaskLogDto } from './dto/register-task-log.dto';
import { UpdateTaskLogDto } from './dto/update-task-log.dto';
import { FindTaskLogsDto } from './dto/find-task-logs.dto';
import { TaskLogApprovalStatus, TaskType } from '@prisma/client';
import { UserData } from './types/user-data.type';

@Injectable()
export class TaskLogsService {
  constructor(private prisma: PrismaService) {}

  async register(registerTaskLogDto: RegisterTaskLogDto, createdByUserId: string) {
    let productId: string | undefined;

    // Отримуємо задачу для отримання її вартості
    const task = await this.prisma.task.findUnique({
      where: { id: registerTaskLogDto.taskId }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Валідація проекту: DTO має відповідати проекту задачі
    if (registerTaskLogDto.projectId !== (task as any).projectId) {
      throw new BadRequestException('projectId у DTO не відповідає проекту задачі');
    }

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
        userId: createdByUserId,
        taskId: registerTaskLogDto.taskId,
        productId: productId,
        timeSpent: registerTaskLogDto.timeSpent,
        quantity: registerTaskLogDto.quantity,
        registeredAt: registeredDate,
        cost: task.cost, // Додаємо вартість з задачі
      },
      include: {
        user: true,
        task: true,
        product: true,
        statusHistory: {
          include: { user: true },
        },
      },
    });

    // Inventory integration: create PRODUCTION log when partId & quantity provided
    // Uses logical idempotency: check taskLogId + partId before create (no DB constraint)
    if (registerTaskLogDto.partId && registerTaskLogDto.quantity && registerTaskLogDto.projectId) {
      // Перевірка, що part належить тому самому проекту
      const part = await this.prisma.part.findUnique({ where: { id: registerTaskLogDto.partId } });
      if (!part || (part as any).projectId !== registerTaskLogDto.projectId) {
        throw new BadRequestException('partId не належить вказаному проекту');
      }
      const qty = Number(registerTaskLogDto.quantity);
      if (qty > 0) {
        // Check for existing log with same taskLogId + partId (logical idempotency)
        const existing = await this.prisma.inventoryLog.findFirst({
          where: {
            taskLogId: taskLog.id,
            partId: registerTaskLogDto.partId,
          },
        });
        // Round to avoid floating point precision errors
        const roundedQty = Math.round(qty * 1000) / 1000;
        if (!existing) {
          await this.prisma.inventoryLog.create({
            data: {
              projectId: registerTaskLogDto.projectId,
              partId: registerTaskLogDto.partId,
              type: 'PRODUCTION' as any,
              quantity: new Prisma.Decimal(roundedQty),
              taskLogId: taskLog.id,
              createdById: createdByUserId,
              note: `Auto from taskLog ${taskLog.id}`,
            },
          });
        } else {
          // Update existing log if it exists
          await this.prisma.inventoryLog.update({
            where: { id: existing.id },
            data: {
              quantity: new Prisma.Decimal(roundedQty),
              note: `Auto from taskLog ${taskLog.id}`,
            },
          });
        }
      }
    }

    // Inventory recipe integration: outputs and consumptions defined per task
    if (registerTaskLogDto.projectId && registerTaskLogDto.quantity && registerTaskLogDto.quantity > 0) {
      const qty = Number(registerTaskLogDto.quantity);
      // Load recipe
      const [outputs, consumptions] = await Promise.all([
        this.prisma.taskOutputPart.findMany({ where: { taskId: registerTaskLogDto.taskId } }),
        this.prisma.taskPartConsumption.findMany({ where: { taskId: registerTaskLogDto.taskId } }),
      ]);

      if (outputs.length || consumptions.length) {
        // Validate parts belong to project
        const partIds = Array.from(new Set([
          ...outputs.map(o => o.partId),
          ...consumptions.map(c => c.partId),
        ]));
        const parts = await this.prisma.part.findMany({ where: { id: { in: partIds }, projectId: registerTaskLogDto.projectId } });
        if (parts.length !== partIds.length) {
          throw new BadRequestException('Recipe contains parts outside the project');
        }

        // Validate non-negative after consumptions
        if (consumptions.length > 0) {
          const sums = await this.prisma.inventoryLog.groupBy({
            by: ['partId'],
            where: { projectId: registerTaskLogDto.projectId, partId: { in: consumptions.map(c => c.partId) } },
            _sum: { quantity: true },
          });
          const qtyByPart: Record<string, number> = {};
          for (const s of sums) qtyByPart[s.partId] = Number(s._sum.quantity || 0);
          for (const c of consumptions) {
            // Use Decimal arithmetic to avoid floating point precision errors
            const quantityPerUnit = Number(c.quantityPerUnit);
            const willConsume = Math.round((quantityPerUnit * qty) * 1000) / 1000; // Round to 3 decimal places
            const current = qtyByPart[c.partId] ?? 0;
            if (current - willConsume < 0) {
              throw new BadRequestException('Insufficient inventory for consumption parts');
            }
          }
        }

        // Create logs with logical idempotency (check taskLogId + partId before create)
        // Note: We don't use database constraints - instead we rely on application logic
        // to check existence before create. This avoids issues with NULL values in
        // composite unique indexes and database state synchronization.
        await this.prisma.$transaction(async (tx) => {
          for (const o of outputs) {
            // Use rounded arithmetic to avoid floating point precision errors
            const perUnit = Number(o.perUnit);
            const produced = Math.round((perUnit * qty) * 1000) / 1000; // Round to 3 decimal places
            if (produced > 0) {
              // Always check existence first to avoid constraint violations
              const existing = await tx.inventoryLog.findFirst({
                where: {
                  taskLogId: taskLog.id,
                  partId: o.partId,
                },
              });
              
              if (existing) {
                // Update existing log
                await tx.inventoryLog.update({
                  where: { id: existing.id },
                  data: {
                    quantity: new Prisma.Decimal(produced),
                    note: `Auto output from taskLog ${taskLog.id}`,
                  },
                });
              } else {
                // Create new log
                await tx.inventoryLog.create({
                  data: {
                    projectId: registerTaskLogDto.projectId!,
                    partId: o.partId,
                    type: 'PRODUCTION' as any,
                    quantity: new Prisma.Decimal(produced),
                    taskLogId: taskLog.id,
                    createdById: createdByUserId,
                    note: `Auto output from taskLog ${taskLog.id}`,
                  },
                });
              }
            }
          }
          for (const c of consumptions) {
            // Use rounded arithmetic to avoid floating point precision errors
            const quantityPerUnit = Number(c.quantityPerUnit);
            const used = Math.round((quantityPerUnit * qty) * 1000) / 1000; // Round to 3 decimal places
            if (used > 0) {
              // Always check existence first to avoid constraint violations
              const existing = await tx.inventoryLog.findFirst({
                where: {
                  taskLogId: taskLog.id,
                  partId: c.partId,
                },
              });
              
              if (existing) {
                // Update existing log
                await tx.inventoryLog.update({
                  where: { id: existing.id },
                  data: {
                    quantity: new Prisma.Decimal(-used),
                    note: `Auto consumption from taskLog ${taskLog.id}`,
                  },
                });
              } else {
                // Create new log
                await tx.inventoryLog.create({
                  data: {
                    projectId: registerTaskLogDto.projectId!,
                    partId: c.partId,
                    type: 'ADJUSTMENT' as any,
                    quantity: new Prisma.Decimal(-used),
                    taskLogId: taskLog.id,
                    createdById: createdByUserId,
                    note: `Auto consumption from taskLog ${taskLog.id}`,
                  },
                });
              }
            }
          }
        });
      }
    }

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
          totalTimeSpent: log._sum.timeSpent || null,
        };
      }).filter(Boolean)
    };

    console.log('Final response:', response);
    return response;
  }

  async remove(id: string) {
    const taskLog = await this.prisma.taskLog.findUnique({ where: { id } });

    if (!taskLog) {
      throw new NotFoundException(`Task log with ID ${id} not found`);
    }

    await this.prisma.$transaction(async (tx) => {
      // Якщо реєстрація створювала інвентарний лог — додаємо компенсуючий ADJUSTMENT
      const inv = await tx.inventoryLog.findFirst({ where: { taskLogId: id } });
      if (inv) {
        const qty = Number(inv.quantity);
        if (qty !== 0) {
          await tx.inventoryLog.create({
            data: {
              projectId: inv.projectId,
              partId: inv.partId,
              type: 'ADJUSTMENT' as any,
              quantity: -qty,
              taskLogId: undefined,
              createdById: taskLog.userId,
              note: `Compensation for taskLog ${id} deletion`,
            },
          });
        }
      }
      await tx.taskLog.delete({ where: { id } });
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
          totalTimeSpent: log._sum.timeSpent || null,
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