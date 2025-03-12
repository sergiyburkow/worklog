import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        estimatedTime: createTaskDto.estimatedTime,
        type: createTaskDto.type,
        complexity: createTaskDto.complexity,
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
        logs: {
          include: {
            user: true,
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
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
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

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        logs: true
      }
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const { projectId, status, ...updateData } = updateTaskDto;

    if (status && task.logs.length > 0) {
      throw new BadRequestException('Неможливо змінити статус задачі, яка має записи логів');
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...updateData,
        ...(status && { status }),
        ...(projectId && {
          project: {
            connect: {
              id: projectId,
            },
          },
        }),
      },
      include: {
        project: true,
      },
    });
  }

  async remove(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        logs: true
      }
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
} 