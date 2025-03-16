import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, ProjectPaymentResponseDto, CreateProjectPaymentDto } from './dto';
import { ProjectStatus, Prisma, ProjectUserRole, User } from '@prisma/client';
import { ProjectUserDto } from './dto/project-user.dto';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
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
      users: project.users.map(user => ({
        userId: user.userId,
        role: user.role as string,
        user: {
          id: user.user.id,
          name: user.user.name,
          email: user.user.email || '',
        },
      })),
      actualEndDate: project.actualEndDate || undefined,
      quantity: project.quantity || undefined,
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
      users: project.users.map(user => ({
        userId: user.userId,
        role: user.role as string,
        user: {
          id: user.user.id,
          name: user.user.name,
          email: user.user.email || '',
        },
      })),
      actualEndDate: project.actualEndDate || undefined,
      quantity: project.quantity || undefined,
    };
  }

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const { projectUsers, startDate, deadline, ...projectData } = createProjectDto;

    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        startDate: new Date(startDate),
        deadline: new Date(deadline),
        users: {
          create: [
            { userId, role: ProjectUserRole.MANAGER },
            ...projectUsers.map(({ userId, role }) => ({
              userId,
              role,
            })),
          ],
        },
      },
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

    return {
      ...project,
      users: project.users.map(user => ({
        userId: user.userId,
        role: user.role as string,
        user: {
          id: user.user.id,
          name: user.user.name,
          email: user.user.email || '',
        },
      })),
      actualEndDate: project.actualEndDate || undefined,
      quantity: project.quantity || undefined,
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

    return {
      ...project,
      users: project.users.map(user => ({
        userId: user.userId,
        role: user.role as string,
        user: {
          id: user.user.id,
          name: user.user.name,
          email: user.user.email || '',
        },
      })),
      actualEndDate: project.actualEndDate || undefined,
      quantity: project.quantity || undefined,
    };
  }

  async remove(id: string) {
    await this.prisma.project.delete({
      where: { id },
    });
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
            lastName: true,
            callSign: true,
            email: true,
          },
        },
      },
    });

    return projectUsers.map(pu => ({
      id: pu.user.id,
      name: pu.user.name,
      lastName: pu.user.lastName,
      callSign: pu.user.callSign,
      email: pu.user.email,
      role: pu.role,
      isActive: pu.isActive
    }));
  }

  async removeUserFromProject(projectId: string, userId: string) {
    // Check if user has any task logs in the project
    const userLogs = await this.prisma.taskLog.findMany({
      where: {
        task: {
          projectId
        },
        userId
      }
    });

    if (userLogs.length > 0) {
      throw new BadRequestException('Cannot remove user with existing task logs');
    }

    await this.prisma.projectUser.deleteMany({
      where: {
        projectId,
        userId,
      },
    });
  }

  async findProjectPayments(projectId: string): Promise<ProjectPaymentResponseDto[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const payments = await this.prisma.payment.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            callSign: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            lastName: true,
            callSign: true,
          },
        },
      },
    });

    return payments.map(payment => ({
      ...payment,
      amount: Number(payment.amount),
    }));
  }

  async createProjectPayment(
    projectId: string,
    createPaymentDto: CreateProjectPaymentDto,
    req: RequestWithUser,
  ): Promise<ProjectPaymentResponseDto> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const payment = await this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        projectId,
        createdById: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            callSign: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            lastName: true,
            callSign: true,
          },
        },
      },
    });

    return {
      ...payment,
      amount: Number(payment.amount),
    };
  }

  async updateProjectPayment(
    projectId: string,
    paymentId: string,
    updatePaymentDto: CreateProjectPaymentDto,
  ): Promise<ProjectPaymentResponseDto> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const payment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: updatePaymentDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastName: true,
            callSign: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            lastName: true,
            callSign: true,
          },
        },
      },
    });

    return {
      ...payment,
      amount: Number(payment.amount),
    };
  }

  async deleteProjectPayment(projectId: string, paymentId: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    await this.prisma.payment.delete({
      where: { id: paymentId },
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
      users: project.users.map(user => ({
        userId: user.userId,
        role: user.role as string,
        user: {
          id: user.user.id,
          name: user.user.name,
          email: user.user.email || '',
        },
      })),
      actualEndDate: project.actualEndDate || undefined,
      quantity: project.quantity || undefined,
    }));
  }

  async toggleUserActive(projectId: string, userId: string, isActive: boolean) {
    const projectUser = await this.prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          projectId,
          userId,
        },
      },
    });

    if (!projectUser) {
      throw new NotFoundException('Project user not found');
    }

    return this.prisma.projectUser.update({
      where: {
        userId_projectId: {
          projectId,
          userId,
        },
      },
      data: {
        isActive,
      },
    });
  }

  async updateUserRole(projectId: string, userId: string, role: ProjectUserRole) {
    const projectUser = await this.prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          projectId,
          userId,
        },
      },
    });

    if (!projectUser) {
      throw new NotFoundException('Project user not found');
    }

    return this.prisma.projectUser.update({
      where: {
        userId_projectId: {
          projectId,
          userId,
        },
      },
      data: {
        role,
      },
    });
  }
} 