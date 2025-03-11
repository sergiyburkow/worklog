import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { ProjectStatus, Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const projects = await this.prisma.project.findMany({
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return projects.map(project => ({
      ...project,
      projectUsers: project.users,
    }));
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return {
      ...project,
      projectUsers: project.users,
    };
  }

  async create(createProjectDto: CreateProjectDto) {
    const { projectUsers, startDate, deadline, ...projectData } = createProjectDto;

    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        startDate: new Date(startDate),
        deadline: new Date(deadline),
        users: {
          create: projectUsers.map(({ userId, role }) => ({
            userId,
            role,
          })),
        },
      },
      include: {
        users: true,
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      ...project,
      projectUsers: project.users,
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { projectUsers, startDate, deadline, ...projectData } = updateProjectDto;

    // If projectUsers is provided, update user associations
    if (projectUsers) {
      await this.prisma.project.update({
        where: { id },
        data: {
          users: {
            deleteMany: {},
            create: projectUsers.map(({ userId, role }) => ({
              userId,
              role,
            })),
          },
        },
      });
    }

    const project = await this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(deadline && { deadline: new Date(deadline) }),
      },
      include: {
        users: true,
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      ...project,
      projectUsers: project.users,
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
        users: true,
      },
    });

    return projects.map(project => ({
      ...project,
      projectUsers: project.users,
    }));
  }

  async findTasksByProject(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return this.prisma.task.findMany({
      where: {
        projectId: id,
      },
    });
  }

  async findUsersByProject(id: string) {
    const projectUsers = await this.prisma.projectUser.findMany({
      where: { projectId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return projectUsers.map(pu => ({
      id: pu.user.id,
      name: pu.user.name,
      email: pu.user.email,
      role: pu.role,
    }));
  }
} 