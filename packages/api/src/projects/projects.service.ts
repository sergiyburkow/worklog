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
                lastName: true,
                callSign: true,
                email: true,
                phone: true,
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
      startDate: new Date(project.startDate),
      deadline: new Date(project.deadline),
      actualEndDate: project.actualEndDate ? new Date(project.actualEndDate) : undefined,
      users: project.users.map(pu => ({
        userId: pu.userId,
        role: pu.role as string,
        user: {
          id: pu.user.id,
          name: pu.user.name,
          lastName: pu.user.lastName,
          callSign: pu.user.callSign,
          email: pu.user.email || '',
          phone: pu.user.phone || '',
        },
      })),
      quantity: project.quantity || undefined,
    }));
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                lastName: true,
                callSign: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return {
      ...project,
      startDate: new Date(project.startDate),
      deadline: new Date(project.deadline),
      actualEndDate: project.actualEndDate ? new Date(project.actualEndDate) : undefined,
      users: project.users.map(pu => ({
        userId: pu.userId,
        role: pu.role as string,
        user: {
          id: pu.user.id,
          name: pu.user.name,
          lastName: pu.user.lastName,
          callSign: pu.user.callSign,
          email: pu.user.email || '',
          phone: pu.user.phone || '',
        },
      })),
      quantity: project.quantity || undefined,
    };
  }

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const { projectUsers, startDate, deadline, projectCode, ...projectData } = createProjectDto;

    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        ...(projectCode ? { projectCode: projectCode.toUpperCase() } : {}),
        startDate: new Date(startDate),
        deadline: new Date(deadline),
        users: {
          create: [
            { userId, role: ProjectUserRole.MANAGER },
            ...projectUsers.map(({ userId, role }) => ({ userId, role })),
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
                lastName: true,
                callSign: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        client: { select: { id: true, name: true } },
      },
    });

    return {
      ...project,
      startDate: new Date(project.startDate),
      deadline: new Date(project.deadline),
      actualEndDate: project.actualEndDate ? new Date(project.actualEndDate) : undefined,
      client: project.client,
      users: project.users.map(pu => ({
        userId: pu.userId,
        role: pu.role as string,
        user: {
          id: pu.user.id,
          name: pu.user.name,
          lastName: pu.user.lastName,
          callSign: pu.user.callSign,
          email: pu.user.email || '',
          phone: pu.user.phone || '',
        },
      })),
      quantity: project.quantity || undefined,
    };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { projectUsers, startDate, deadline, projectCode, ...projectData } = updateProjectDto;

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
        ...(projectCode && { projectCode: projectCode.toUpperCase() }),
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
                lastName: true,
                callSign: true,
                email: true,
                phone: true,
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
      startDate: new Date(project.startDate),
      deadline: new Date(project.deadline),
      actualEndDate: project.actualEndDate ? new Date(project.actualEndDate) : undefined,
      users: project.users.map(pu => ({
        userId: pu.userId,
        role: pu.role as string,
        user: {
          id: pu.user.id,
          name: pu.user.name,
          lastName: pu.user.lastName,
          callSign: pu.user.callSign,
          email: pu.user.email || '',
          phone: pu.user.phone || '',
        },
      })),
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

    const tasks = await this.prisma.task.findMany({
      where: {
        projectId: id,
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
    const taskIds = tasks.map(t => t.id);
    const [outputs, consumptions] = await Promise.all([
      this.prisma.taskOutputPart.findMany({ 
        where: { taskId: { in: taskIds } }, 
        select: { taskId: true } 
      }),
      this.prisma.taskPartConsumption.findMany({ 
        where: { taskId: { in: taskIds } }, 
        select: { taskId: true } 
      }),
    ]);

    const tasksWithRecipe = new Set([
      ...outputs.map(o => o.taskId),
      ...consumptions.map(c => c.taskId),
    ]);

    return tasks.map(task => ({
      ...task,
      hasRecipe: tasksWithRecipe.has(task.id),
    }));
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

  async getProjectUserPaymentsSum(projectId: string, userId: string): Promise<number> {
    const payments = await this.prisma.payment.findMany({
      where: { 
        projectId,
        userId 
      },
      select: {
        amount: true
      }
    });

    return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
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
                lastName: true,
                callSign: true,
                email: true,
                phone: true,
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
      startDate: new Date(project.startDate),
      deadline: new Date(project.deadline),
      actualEndDate: project.actualEndDate ? new Date(project.actualEndDate) : undefined,
      users: project.users.map(pu => ({
        id: pu.user.id,
        name: pu.user.name,
        lastName: pu.user.lastName,
        callSign: pu.user.callSign,
        email: pu.user.email || '',
        phone: pu.user.phone || '',
        role: pu.role as string,
        isActive: pu.isActive,
      })),
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