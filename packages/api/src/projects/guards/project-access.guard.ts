import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const projectId = request.params.id;
    const user = request.user;

    // Адміністратори мають доступ до всіх проектів
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Перевіряємо, чи користувач є учасником проекту
    const projectUser = await this.prisma.projectUser.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: projectId,
        },
      },
    });

    if (!projectUser) {
      throw new NotFoundException('У вас немає доступу до цього проекту');
    }

    return true;
  }
} 