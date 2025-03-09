import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  TaskTypeResponseDto,
  ProductTaskResponseDto,
  ProjectTaskResponseDto,
  CreateTaskTypeDto,
  CreateProductTaskDto,
  CreateProjectTaskDto,
} from './dto';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Task Types
  @Get('types')
  @ApiOperation({ summary: 'Get all task types' })
  @ApiResponse({ status: 200, description: 'Return all task types', type: [TaskTypeResponseDto] })
  async findAllTypes() {
    return this.tasksService.findAllTypes();
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Get task type by id' })
  @ApiResponse({ status: 200, description: 'Return task type by id', type: TaskTypeResponseDto })
  async findTypeById(@Param('id') id: string) {
    return this.tasksService.findTypeById(id);
  }

  @Post('types')
  @ApiOperation({ summary: 'Create task type' })
  @ApiResponse({ status: 201, description: 'Task type has been created', type: TaskTypeResponseDto })
  async createType(@Body() createTaskTypeDto: CreateTaskTypeDto) {
    return this.tasksService.createType(createTaskTypeDto);
  }

  @Delete('types/:id')
  @ApiOperation({ summary: 'Delete task type' })
  @ApiResponse({ status: 200, description: 'Task type has been deleted' })
  async removeType(@Param('id') id: string) {
    return this.tasksService.removeType(id);
  }

  // Product Tasks
  @Get('product')
  @ApiOperation({ summary: 'Get all product tasks' })
  @ApiResponse({ status: 200, description: 'Return all product tasks', type: [ProductTaskResponseDto] })
  async findAllProductTasks() {
    return this.tasksService.findAllProductTasks();
  }

  @Get('product/:id')
  @ApiOperation({ summary: 'Get product task by id' })
  @ApiResponse({ status: 200, description: 'Return product task by id', type: ProductTaskResponseDto })
  async findProductTaskById(@Param('id') id: string) {
    return this.tasksService.findProductTaskById(id);
  }

  @Get('product/project/:projectId')
  @ApiOperation({ summary: 'Get product tasks by project id' })
  @ApiResponse({ status: 200, description: 'Return product tasks by project id', type: [ProductTaskResponseDto] })
  async findProductTasksByProject(@Param('projectId') projectId: string) {
    return this.tasksService.findProductTasksByProject(projectId);
  }

  @Get('product/user/:userId')
  @ApiOperation({ summary: 'Get product tasks by user id' })
  @ApiResponse({ status: 200, description: 'Return product tasks by user id', type: [ProductTaskResponseDto] })
  async findProductTasksByUser(@Param('userId') userId: string) {
    return this.tasksService.findProductTasksByUser(userId);
  }

  @Post('product')
  @ApiOperation({ summary: 'Create product task' })
  @ApiResponse({ status: 201, description: 'Product task has been created', type: ProductTaskResponseDto })
  async createProductTask(@Body() createProductTaskDto: CreateProductTaskDto) {
    return this.tasksService.createProductTask(createProductTaskDto);
  }

  @Put('product/:id')
  @ApiOperation({ summary: 'Update product task' })
  @ApiResponse({ status: 200, description: 'Product task has been updated', type: ProductTaskResponseDto })
  async updateProductTask(
    @Param('id') id: string,
    @Body() updateProductTaskDto: CreateProductTaskDto,
  ) {
    return this.tasksService.updateProductTask(id, updateProductTaskDto);
  }

  @Delete('product/:id')
  @ApiOperation({ summary: 'Delete product task' })
  @ApiResponse({ status: 200, description: 'Product task has been deleted' })
  async removeProductTask(@Param('id') id: string) {
    return this.tasksService.removeProductTask(id);
  }

  // Project Tasks
  @Get('project')
  @ApiOperation({ summary: 'Get all project tasks' })
  @ApiResponse({ status: 200, description: 'Return all project tasks', type: [ProjectTaskResponseDto] })
  async findAllProjectTasks() {
    return this.tasksService.findAllProjectTasks();
  }

  @Get('project/:id')
  @ApiOperation({ summary: 'Get project task by id' })
  @ApiResponse({ status: 200, description: 'Return project task by id', type: ProjectTaskResponseDto })
  async findProjectTaskById(@Param('id') id: string) {
    return this.tasksService.findProjectTaskById(id);
  }

  @Get('project/project/:projectId')
  @ApiOperation({ summary: 'Get project tasks by project id' })
  @ApiResponse({ status: 200, description: 'Return project tasks by project id', type: [ProjectTaskResponseDto] })
  async findProjectTasksByProject(@Param('projectId') projectId: string) {
    return this.tasksService.findProjectTasksByProject(projectId);
  }

  @Post('project')
  @ApiOperation({ summary: 'Create project task' })
  @ApiResponse({ status: 201, description: 'Project task has been created', type: ProjectTaskResponseDto })
  async createProjectTask(@Body() createProjectTaskDto: CreateProjectTaskDto) {
    return this.tasksService.createProjectTask(createProjectTaskDto);
  }

  @Put('project/:id')
  @ApiOperation({ summary: 'Update project task' })
  @ApiResponse({ status: 200, description: 'Project task has been updated', type: ProjectTaskResponseDto })
  async updateProjectTask(
    @Param('id') id: string,
    @Body() updateProjectTaskDto: CreateProjectTaskDto,
  ) {
    return this.tasksService.updateProjectTask(id, updateProjectTaskDto);
  }

  @Delete('project/:id')
  @ApiOperation({ summary: 'Delete project task' })
  @ApiResponse({ status: 200, description: 'Project task has been deleted' })
  async removeProjectTask(@Param('id') id: string) {
    return this.tasksService.removeProjectTask(id);
  }
} 