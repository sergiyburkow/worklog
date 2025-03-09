import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const projects = await this.prisma.project.findMany({
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    return projects.map(project => ({
      ...project,
      userIds: project.users.map(u => u.userId),
    }));
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return {
      ...project,
      userIds: project.users.map(u => u.userId),
    };
  }

  async create(createProjectDto: CreateProjectDto) {
    const { userIds, ...projectData } = createProjectDto;

    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        users: {
          create: userIds.map(userId => ({
            userId,
          })),
        },
      },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    return {
      ...project,
      userIds: project.users.map(u => u.userId),
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { userIds, ...projectData } = updateProjectDto;

    // If userIds is provided, update user associations
    if (userIds) {
      // First, remove all existing associations
      await this.prisma.projectUser.deleteMany({
        where: { projectId: id },
      });

      // Then create new associations
      await this.prisma.projectUser.createMany({
        data: userIds.map(userId => ({
          projectId: id,
          userId,
        })),
      });
    }

    const project = await this.prisma.project.update({
      where: { id },
      data: projectData,
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    return {
      ...project,
      userIds: project.users.map(u => u.userId),
    };
  }

  async remove(id: string) {
    await this.prisma.project.delete({
      where: { id },
    });
  }

  async findByUser(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    return projects.map(project => ({
      ...project,
      userIds: project.users.map(u => u.userId),
    }));
  }
} 