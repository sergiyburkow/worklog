import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { TaskGroupsService } from './task-groups.service';
import { CreateTaskGroupDto, UpdateTaskGroupDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectAccessGuard } from '../projects/guards/project-access.guard';
@ApiTags('task-groups')
@Controller('projects/:projectId/task-groups')
@UseGuards(JwtAuthGuard, ProjectAccessGuard)
@ApiBearerAuth()
export class TaskGroupsController {
  constructor(private readonly taskGroupsService: TaskGroupsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Отримати список груп задач для проекту',
    description: 'Повертає всі групи задач проекту, відсортовані за sortOrder та назвою. Кожна група включає кількість задач у групі.'
  })
  @ApiParam({ 
    name: 'projectId', 
    description: 'ID проекту', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список груп задач успішно отримано',
    schema: {
      type: 'object',
      properties: {
        groups: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
              name: { type: 'string', example: 'Фасадні роботи' },
              description: { type: 'string', nullable: true, example: 'Всі задачі, пов\'язані з фасадними роботами' },
              sortOrder: { type: 'number', example: 0 },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              taskCount: { type: 'number', example: 5 },
            },
          },
        },
      },
    },
  })
  list(@Param('projectId') projectId: string) {
    return this.taskGroupsService.findAll(projectId);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Створити нову групу задач',
    description: 'Створює нову групу задач для проекту. Доступ для ADMIN та PROJECT_MANAGER (перевіряється через ProjectAccessGuard).'
  })
  @ApiParam({ 
    name: 'projectId', 
    description: 'ID проекту', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @ApiBody({ type: CreateTaskGroupDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Група задач успішно створена',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
        sortOrder: { type: 'number' },
        projectId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  create(@Param('projectId') projectId: string, @Body() dto: CreateTaskGroupDto) {
    return this.taskGroupsService.create(projectId, dto);
  }

  @Put(':groupId')
  @ApiOperation({ 
    summary: 'Оновити групу задач',
    description: 'Оновлює існуючу групу задач. Доступ для ADMIN та PROJECT_MANAGER (перевіряється через ProjectAccessGuard).'
  })
  @ApiParam({ 
    name: 'projectId', 
    description: 'ID проекту', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @ApiParam({ 
    name: 'groupId', 
    description: 'ID групи задач', 
    example: '550e8400-e29b-41d4-a716-446655440001' 
  })
  @ApiBody({ type: UpdateTaskGroupDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Група задач успішно оновлена' 
  })
  @ApiResponse({ status: 404, description: 'Групу задач не знайдено' })
  update(
    @Param('projectId') projectId: string,
    @Param('groupId') groupId: string,
    @Body() dto: UpdateTaskGroupDto,
  ) {
    return this.taskGroupsService.update(projectId, groupId, dto);
  }

  @Delete(':groupId')
  @ApiOperation({ 
    summary: 'Видалити групу задач',
    description: 'Видаляє групу задач. Задачі, що належали цій групі, отримують groupId = null (залишаються без групи). Доступ для ADMIN та PROJECT_MANAGER (перевіряється через ProjectAccessGuard).'
  })
  @ApiParam({ 
    name: 'projectId', 
    description: 'ID проекту', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @ApiParam({ 
    name: 'groupId', 
    description: 'ID групи задач', 
    example: '550e8400-e29b-41d4-a716-446655440001' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Група задач успішно видалена' 
  })
  @ApiResponse({ status: 404, description: 'Групу задач не знайдено' })
  remove(@Param('projectId') projectId: string, @Param('groupId') groupId: string) {
    return this.taskGroupsService.remove(projectId, groupId);
  }
}

