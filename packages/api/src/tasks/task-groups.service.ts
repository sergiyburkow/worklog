import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskGroupDto, UpdateTaskGroupDto } from './dto';

@Injectable()
export class TaskGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string) {
    const groups = await this.prisma.taskGroup.findMany({
      where: { projectId },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    return {
      groups: groups.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        sortOrder: g.sortOrder,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
        taskCount: g._count.tasks,
      })),
    };
  }

  async create(projectId: string, dto: CreateTaskGroupDto) {
    return this.prisma.taskGroup.create({
      data: {
        projectId,
        name: dto.name,
        description: dto.description ?? null,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(projectId: string, groupId: string, dto: UpdateTaskGroupDto) {
    // Перевіряємо що група належить проекту
    const group = await (this.prisma as any).taskGroup.findFirst({
      where: { id: groupId, projectId },
    });

    if (!group) {
      throw new NotFoundException('Task group not found');
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description ?? null;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    return this.prisma.taskGroup.update({
      where: { id: groupId },
      data: updateData,
    });
  }

  async remove(projectId: string, groupId: string) {
    // Перевіряємо що група належить проекту
    const group = await (this.prisma as any).taskGroup.findFirst({
      where: { id: groupId, projectId },
    });

    if (!group) {
      throw new NotFoundException('Task group not found');
    }

    // При видаленні групи, задачі отримують groupId = null через ON DELETE SET NULL
    await this.prisma.taskGroup.delete({
      where: { id: groupId },
    });
  }
}

