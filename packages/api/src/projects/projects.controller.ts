import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectResponseDto, CreateProjectDto, UpdateProjectDto, TaskResponseDto, ProjectUserResponseDto, ProjectPaymentResponseDto, CreateProjectPaymentDto } from './dto';
import { ProjectUserRole } from '@prisma/client';
import { ProjectAccessGuard } from './guards/project-access.guard';
import { Request } from 'express';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects', type: [ProjectResponseDto] })
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @UseGuards(ProjectAccessGuard)
  @ApiOperation({ summary: 'Get project by id' })
  @ApiResponse({ status: 200, description: 'Return project by id', type: ProjectResponseDto })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create project' })
  @ApiResponse({ status: 201, description: 'Project has been created', type: ProjectResponseDto })
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project has been updated', type: ProjectResponseDto })
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 200, description: 'Project has been deleted' })
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get projects by user id' })
  @ApiResponse({ status: 200, description: 'Return projects by user id', type: [ProjectResponseDto] })
  async findByUser(@Param('userId') userId: string) {
    return this.projectsService.findByUser(userId);
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get tasks by project id' })
  @ApiResponse({ status: 200, description: 'Return tasks by project id', type: [TaskResponseDto] })
  async findTasksByProject(@Param('id') id: string) {
    return this.projectsService.findTasksByProject(id);
  }

  @Get(':id/users')
  @UseGuards(ProjectAccessGuard)
  @ApiOperation({ summary: 'Get users by project id' })
  @ApiResponse({ status: 200, description: 'Return users by project id', type: [ProjectUserResponseDto] })
  async findUsersByProject(@Param('id') id: string) {
    return this.projectsService.findUsersByProject(id);
  }

  @Delete(':projectId/users/:userId')
  @ApiOperation({ summary: 'Remove user from project' })
  @ApiResponse({ status: 200, description: 'User has been removed from project' })
  async removeUser(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return this.projectsService.removeUserFromProject(projectId, userId);
  }

  @Put(':projectId/users/:userId/toggle-active')
  @ApiOperation({ summary: 'Toggle user active status in project' })
  @ApiResponse({ status: 200, description: 'User status has been updated' })
  async toggleUserActive(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.projectsService.toggleUserActive(projectId, userId, isActive);
  }

  @Put(':projectId/users/:userId/role')
  @ApiOperation({ summary: 'Update user role in project' })
  @ApiResponse({ status: 200, description: 'User role has been updated' })
  async updateUserRole(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Body('role') role: ProjectUserRole,
  ) {
    return this.projectsService.updateUserRole(projectId, userId, role);
  }

  @Get(':projectId/payments')
  @UseGuards(ProjectAccessGuard)
  @ApiOperation({ summary: 'Get project payments' })
  @ApiResponse({
    status: 200,
    description: 'Returns project payments',
    type: [ProjectPaymentResponseDto],
  })
  async findProjectPayments(@Param('projectId') projectId: string): Promise<ProjectPaymentResponseDto[]> {
    return this.projectsService.findProjectPayments(projectId);
  }

  @Post(':projectId/payments')
  @UseGuards(ProjectAccessGuard)
  @ApiOperation({ summary: 'Create project payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment has been created',
    type: ProjectPaymentResponseDto,
  })
  async createProjectPayment(
    @Param('projectId') projectId: string,
    @Body() createPaymentDto: CreateProjectPaymentDto,
    @Req() req: Request,
  ): Promise<ProjectPaymentResponseDto> {
    return this.projectsService.createProjectPayment(projectId, createPaymentDto, req);
  }

  @Put(':projectId/payments/:paymentId')
  @UseGuards(ProjectAccessGuard)
  @ApiOperation({ summary: 'Update project payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment has been updated',
    type: ProjectPaymentResponseDto,
  })
  async updateProjectPayment(
    @Param('projectId') projectId: string,
    @Param('paymentId') paymentId: string,
    @Body() updatePaymentDto: CreateProjectPaymentDto,
  ): Promise<ProjectPaymentResponseDto> {
    return this.projectsService.updateProjectPayment(projectId, paymentId, updatePaymentDto);
  }

  @Delete(':projectId/payments/:paymentId')
  @UseGuards(ProjectAccessGuard)
  @ApiOperation({ summary: 'Delete project payment' })
  @ApiResponse({
    status: 200,
    description: 'Payment has been deleted',
  })
  async deleteProjectPayment(
    @Param('projectId') projectId: string,
    @Param('paymentId') paymentId: string,
  ): Promise<void> {
    return this.projectsService.deleteProjectPayment(projectId, paymentId);
  }
} 