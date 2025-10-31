import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface'

@Injectable()
export class TaskProjectAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>()
    const user = req.user
    const taskId = req.params.taskId || req.params.id
    if (!user || !taskId) return false

    const task = await this.prisma.task.findUnique({ where: { id: taskId } })
    if (!task) return false

    // Admins/PMs allowed by role
    if (user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER') return true

    // Members of the project are allowed
    const member = await this.prisma.projectUser.findUnique({ where: { userId_projectId: { userId: user.id, projectId: task.projectId } } })
    return !!member
  }
}



