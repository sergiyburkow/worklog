import { Controller, Post, Body, UseGuards, Get, Param, Delete, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TaskLogsService } from './task-logs.service';
import { RegisterTaskLogDto } from './dto/register-task-log.dto';
import { UpdateTaskLogDto } from './dto/update-task-log.dto';
import { FindTaskLogsDto } from './dto/find-task-logs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('task-logs')
@Controller('task-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskLogsController {
  constructor(private readonly taskLogsService: TaskLogsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register completed task' })
  @ApiResponse({ status: 201, description: 'Task has been registered' })
  async register(@Body() registerTaskLogDto: RegisterTaskLogDto) {
    return this.taskLogsService.register(registerTaskLogDto);
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
  @ApiOperation({ summary: 'Get all registered tasks for user in project' })
  @ApiResponse({ status: 200, description: 'Return all registered tasks for user in project' })
  async findByProjectAndUser(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.taskLogsService.findByProjectAndUser(projectId, userId);
  }

  @Get('project/:projectId/user/:userId/summary')
  @ApiOperation({ summary: 'Get summary of registered tasks for user in project' })
  @ApiResponse({ status: 200, description: 'Return summary of registered tasks for user in project' })
  async getProjectUserTasksSummary(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
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