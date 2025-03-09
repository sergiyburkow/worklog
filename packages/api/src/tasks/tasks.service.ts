import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskTypeDto, CreateProductTaskDto, CreateProjectTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // Task Types
  async findAllTypes() {
    return this.prisma.taskType.findMany();
  }

  async findTypeById(id: string) {
    const type = await this.prisma.taskType.findUnique({
      where: { id },
    });

    if (!type) {
      throw new NotFoundException(`Task type with ID ${id} not found`);
    }

    return type;
  }

  async createType(createTaskTypeDto: CreateTaskTypeDto) {
    return this.prisma.taskType.create({
      data: createTaskTypeDto,
    });
  }

  async removeType(id: string) {
    await this.prisma.taskType.delete({
      where: { id },
    });
  }

  // Product Tasks
  async findAllProductTasks() {
    return this.prisma.productTask.findMany();
  }

  async findProductTaskById(id: string) {
    const task = await this.prisma.productTask.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Product task with ID ${id} not found`);
    }

    return task;
  }

  async findProductTasksByProject(projectId: string) {
    return this.prisma.productTask.findMany({
      where: { projectId },
    });
  }

  async findProductTasksByUser(userId: string) {
    return this.prisma.productTask.findMany({
      where: { userId },
    });
  }

  async createProductTask(createProductTaskDto: CreateProductTaskDto) {
    return this.prisma.productTask.create({
      data: createProductTaskDto,
    });
  }

  async updateProductTask(id: string, updateProductTaskDto: CreateProductTaskDto) {
    return this.prisma.productTask.update({
      where: { id },
      data: updateProductTaskDto,
    });
  }

  async removeProductTask(id: string) {
    await this.prisma.productTask.delete({
      where: { id },
    });
  }

  // Project Tasks
  async findAllProjectTasks() {
    return this.prisma.projectTask.findMany();
  }

  async findProjectTaskById(id: string) {
    const task = await this.prisma.projectTask.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Project task with ID ${id} not found`);
    }

    return task;
  }

  async findProjectTasksByProject(projectId: string) {
    return this.prisma.projectTask.findMany({
      where: { projectId },
    });
  }

  async createProjectTask(createProjectTaskDto: CreateProjectTaskDto) {
    return this.prisma.projectTask.create({
      data: createProjectTaskDto,
    });
  }

  async updateProjectTask(id: string, updateProjectTaskDto: CreateProjectTaskDto) {
    return this.prisma.projectTask.update({
      where: { id },
      data: updateProjectTaskDto,
    });
  }

  async removeProjectTask(id: string) {
    await this.prisma.projectTask.delete({
      where: { id },
    });
  }
} 