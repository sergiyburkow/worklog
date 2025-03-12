import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskType } from '@prisma/client';
import { TaskStatus } from './dto/update-task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        type: createTaskDto.type,
        complexity: createTaskDto.complexity,
        tags: createTaskDto.tags,
        estimatedTime: createTaskDto.estimatedTime ? new Prisma.Decimal(createTaskDto.estimatedTime) : new Prisma.Decimal(0),
        project: {
          connect: {
            id: createTaskDto.projectId,
          },
        },
      },
      include: {
        project: true,
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
      ...(updateTaskDto.name && { name: updateTaskDto.name }),
      ...(updateTaskDto.description && { description: updateTaskDto.description }),
      ...(updateTaskDto.type && { type: updateTaskDto.type }),
      ...(updateTaskDto.complexity && { complexity: updateTaskDto.complexity }),
      ...(updateTaskDto.tags && { tags: updateTaskDto.tags }),
      ...(updateTaskDto.status && { status: updateTaskDto.status }),
      ...(updateTaskDto.estimatedTime && { 
        estimatedTime: new Prisma.Decimal(updateTaskDto.estimatedTime) 
      }),
      ...(updateTaskDto.projectId && {
        project: {
          connect: {
            id: updateTaskDto.projectId,
          },
        },
      }),
    };

    return this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
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
    return this.prisma.task.findMany({
      where: {
        projectId,
      },
      include: {
        project: true,
      },
    });
  }
}