import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskType } from '@prisma/client';
import { TaskStatus } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';
import { TaskRecipeOutputDto, TaskRecipeConsumptionDto } from './dto/recipe.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    // Перевіряємо що група належить до проекту (якщо вказана)
    if (createTaskDto.groupId) {
      const group = await this.prisma.taskGroup.findFirst({
        where: { id: createTaskDto.groupId, projectId: createTaskDto.projectId },
      });
      if (!group) {
        throw new BadRequestException('Task group does not belong to the project');
      }
    }

    return this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        type: createTaskDto.type,
        complexity: createTaskDto.complexity,
        tags: createTaskDto.tags,
        estimatedTime: createTaskDto.estimatedTime ? new Prisma.Decimal(createTaskDto.estimatedTime) : new Prisma.Decimal(0),
        cost: createTaskDto.cost ? new Prisma.Decimal(createTaskDto.cost) : new Prisma.Decimal(0),
        project: {
          connect: {
            id: createTaskDto.projectId,
          },
        },
        ...(createTaskDto.groupId && {
          group: {
            connect: {
              id: createTaskDto.groupId,
            },
          },
        }),
      },
      include: {
        project: true,
        group: {
          select: {
            id: true,
            name: true,
            sortOrder: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        project: true,
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        group: {
          select: {
            id: true,
            name: true,
            sortOrder: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        logs: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Якщо є логи і намагаємось змінити статус
    if (task.logs.length > 0 && updateTaskDto.status) {
      throw new BadRequestException('Неможливо змінити статус задачі, яка має записи логів');
    }

    const updateData: Prisma.TaskUpdateInput = {
      ...(updateTaskDto.name !== undefined && { name: updateTaskDto.name }),
      ...(updateTaskDto.description !== undefined && { description: updateTaskDto.description ?? null }),
      ...(updateTaskDto.type !== undefined && { type: updateTaskDto.type }),
      ...(updateTaskDto.complexity !== undefined && { complexity: updateTaskDto.complexity ?? null }),
      ...(updateTaskDto.tags !== undefined && { tags: updateTaskDto.tags ?? null }),
      ...(updateTaskDto.status !== undefined && { status: updateTaskDto.status }),
      ...(updateTaskDto.estimatedTime !== undefined && { 
        estimatedTime: updateTaskDto.estimatedTime ? new Prisma.Decimal(updateTaskDto.estimatedTime) : new Prisma.Decimal(0)
      }),
      ...(updateTaskDto.cost !== undefined && { 
        cost: new Prisma.Decimal(updateTaskDto.cost) 
      }),
      ...(updateTaskDto.projectId && {
        project: {
          connect: {
            id: updateTaskDto.projectId,
          },
        },
      }),
    };

    // Обробка groupId: перевірка та оновлення
    if (updateTaskDto.groupId !== undefined) {
      const projectId = updateTaskDto.projectId || task.projectId;
      
      if (updateTaskDto.groupId === null || updateTaskDto.groupId === '') {
        // Прибрати з групи
        updateData.group = { disconnect: true };
      } else if (updateTaskDto.groupId) {
        // Перевіряємо що група належить до проекту
        const group = await this.prisma.taskGroup.findFirst({
          where: { id: updateTaskDto.groupId, projectId },
        });
        if (!group) {
          throw new BadRequestException('Task group does not belong to the project');
        }
        // Встановлюємо групу через connect
        updateData.group = { connect: { id: updateTaskDto.groupId } };
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        group: {
          select: {
            id: true,
            name: true,
            sortOrder: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        logs: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.logs.length > 0) {
      throw new BadRequestException('Неможливо видалити задачу, яка має записи логів');
    }

    await this.prisma.task.delete({
      where: { id },
    });
  }

  async findByProject(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        project: true,
        group: {
          select: {
            id: true,
            name: true,
            sortOrder: true,
          },
        },
      },
    });
    
    // Додаємо інформацію про наявність рецепта
    const taskIds = tasks.map(t => t.id)
    const [outputs, consumptions] = await Promise.all([
      this.prisma.taskOutputPart.findMany({ where: { taskId: { in: taskIds } }, select: { taskId: true } }),
      this.prisma.taskPartConsumption.findMany({ where: { taskId: { in: taskIds } }, select: { taskId: true } }),
    ])
    
    const tasksWithRecipe = new Set([
      ...outputs.map(o => o.taskId),
      ...consumptions.map(c => c.taskId),
    ])
    
    return tasks.map(task => ({
      ...task,
      hasRecipe: tasksWithRecipe.has(task.id),
    }))
  }

  async getRecipe(taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } })
    if (!task) throw new NotFoundException('Task not found')
    const [outputs, consumptions] = await Promise.all([
      this.prisma.taskOutputPart.findMany({ where: { taskId } }),
      this.prisma.taskPartConsumption.findMany({ where: { taskId } }),
    ])
    return { projectId: task.projectId, outputs, consumptions }
  }

  async addOutput(taskId: string, dto: TaskRecipeOutputDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } })
    if (!task) throw new NotFoundException('Task not found')
    const part = await this.prisma.part.findUnique({ where: { id: dto.partId } })
    if (!part || (part as any).projectId !== task.projectId) throw new BadRequestException('Part must belong to the same project')
    return this.prisma.taskOutputPart.upsert({
      where: { taskId_partId: { taskId, partId: dto.partId } },
      create: { taskId, partId: dto.partId, perUnit: new Prisma.Decimal(dto.perUnit) },
      update: { perUnit: new Prisma.Decimal(dto.perUnit) },
    })
  }

  async removeOutput(taskId: string, partId: string) {
    await this.prisma.taskOutputPart.delete({ where: { taskId_partId: { taskId, partId } } })
    return { ok: true }
  }

  async addConsumption(taskId: string, dto: TaskRecipeConsumptionDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } })
    if (!task) throw new NotFoundException('Task not found')
    const part = await this.prisma.part.findUnique({ where: { id: dto.partId } })
    if (!part || (part as any).projectId !== task.projectId) throw new BadRequestException('Part must belong to the same project')
    return this.prisma.taskPartConsumption.upsert({
      where: { taskId_partId: { taskId, partId: dto.partId } },
      create: { taskId, partId: dto.partId, quantityPerUnit: new Prisma.Decimal(dto.quantityPerUnit) },
      update: { quantityPerUnit: new Prisma.Decimal(dto.quantityPerUnit) },
    })
  }

  async removeConsumption(taskId: string, partId: string) {
    await this.prisma.taskPartConsumption.delete({ where: { taskId_partId: { taskId, partId } } })
    return { ok: true }
  }
}