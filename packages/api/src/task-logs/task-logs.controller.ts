import { Controller, Post, Body, UseGuards, Get, Param, Delete, Put, Query, Patch, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TaskLogsService } from './task-logs.service';
import { RegisterTaskLogDto } from './dto/register-task-log.dto';
import { UpdateTaskLogDto } from './dto/update-task-log.dto';
import { FindTaskLogsDto } from './dto/find-task-logs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { UserData, UserDataResponse } from './types/user-data.type';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';

@ApiTags('task-logs')
@Controller('task-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskLogsController {
  constructor(private readonly taskLogsService: TaskLogsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register completed task' })
  @ApiResponse({ status: 201, description: 'Task has been registered' })
  async register(@Body() registerTaskLogDto: RegisterTaskLogDto, @Req() req: RequestWithUser) {
    return this.taskLogsService.register(registerTaskLogDto, req.user.id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all registered tasks for project' })
  @ApiResponse({ status: 200, description: 'Return all registered tasks for project' })
  async findByProject(
    @Param('projectId') projectId: string,
    @Query() filters: FindTaskLogsDto
  ) {
    return this.taskLogsService.findByProject(projectId, filters);
  }

  @Get('project/:projectId/user/:userId')
  @ApiOperation({ summary: 'Get user details in project context' })
  @ApiResponse({ status: 200, description: 'Return user details in project context', type: UserDataResponse })
  async getProjectUser(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ): Promise<UserData> {
    return this.taskLogsService.getProjectUser(projectId, userId);
  }

  @Get('project/:projectId/logsbytasks')
  @ApiOperation({ summary: 'Get logs grouped by tasks for project' })
  @ApiResponse({ status: 200, description: 'Return logs grouped by tasks for project' })
  async getLogsByTasks(
    @Param('projectId') projectId: string,
    @Query('userId') userId?: string,
  ) {
    return this.taskLogsService.getLogsByTasks(projectId, userId);
  }

  @Get('project/:projectId/user/:userId/logs')
  @ApiOperation({ summary: 'Get user logs by days in project context' })
  @ApiResponse({ status: 200, description: 'Return user logs by days in project context' })
  async getUserLogsByDays(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.taskLogsService.getUserLogsByDays(projectId, userId);
  }

  @Get('project/:projectId/user/:userId/summary')
  @ApiOperation({ summary: 'Get task logs summary by project and user' })
  @ApiResponse({ status: 200, description: 'Task logs summary has been found' })
  async getProjectUserTasksSummary(@Param('projectId') projectId: string, @Param('userId') userId: string) {
    return this.taskLogsService.getProjectUserTasksSummary(projectId, userId);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete task log' })
  @ApiResponse({ status: 200, description: 'Task log has been deleted' })
  async remove(@Param('id') id: string) {
    return this.taskLogsService.remove(id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update task log' })
  @ApiResponse({ status: 200, description: 'Task log has been updated' })
  async update(@Param('id') id: string, @Body() updateTaskLogDto: UpdateTaskLogDto) {
    return this.taskLogsService.update(id, updateTaskLogDto);
  }
} 