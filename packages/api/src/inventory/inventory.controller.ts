import { Controller, Get, Param, Post, Body, Query, UseGuards, Req, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreatePartDto } from './dto/create-part.dto';
import { CreateInventoryLogDto } from './dto/create-inventory-log.dto';
import { INVENTORY_UNITS } from './units';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectAccessGuard } from '../projects/guards/project-access.guard';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { CreatePartGroupDto } from './dto/create-part-group.dto';
import { UpdatePartGroupDto } from './dto/update-part-group.dto';
import { UpdatePartDto } from './dto/update-part.dto';

@ApiTags('inventory')
@ApiBearerAuth()
@Controller('projects/:projectId/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'List inventory parts grouped with aggregates' })
  @ApiResponse({ status: 200, description: 'Returns inventory parts' })
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  @ApiQuery({ name: 'groupId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'onlyDeficit', required: false, schema: { type: 'boolean' } })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'integer', minimum: 1 } })
  @ApiQuery({ name: 'pageSize', required: false, schema: { type: 'integer', minimum: 1, maximum: 100 } })
  list(@Param('projectId') projectId: string, @Query() query: any) {
    return this.inventoryService.list(projectId, query);
  }

  @Get('units')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get standardized inventory units' })
  units() {
    return { units: INVENTORY_UNITS };
  }

  @Get('reports/deficit')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  @ApiOperation({ summary: 'List deficit parts (requiredQuantity > 0)' })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'integer', minimum: 1 } })
  @ApiQuery({ name: 'pageSize', required: false, schema: { type: 'integer', minimum: 1, maximum: 100 } })
  reportDeficit(@Param('projectId') projectId: string, @Query() query: any) {
    return this.inventoryService.reportDeficit(projectId, query);
  }

  @Get('reports/movements')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  @ApiOperation({ summary: 'Inventory movements summary by type for a period' })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  reportMovements(@Param('projectId') projectId: string, @Query() query: any) {
    return this.inventoryService.reportMovements(projectId, query);
  }

  @Get('reports/top-deficit')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  @ApiOperation({ summary: 'Top deficit parts by requiredQuantity' })
  @ApiQuery({ name: 'limit', required: false, schema: { type: 'integer', minimum: 1, maximum: 100 } })
  reportTopDeficit(@Param('projectId') projectId: string, @Query() query: any) {
    return this.inventoryService.reportTopDeficit(projectId, query);
  }

  @Post('parts')
  @ApiOperation({ summary: 'Create a new part' })
  @ApiResponse({ status: 201, description: 'Part created' })
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  createPart(@Param('projectId') projectId: string, @Body() dto: CreatePartDto) {
    return this.inventoryService.createPart(projectId, dto);
  }

  @Post('parts/:partId/logs')
  @ApiOperation({ summary: 'Add inventory log entry' })
  @ApiResponse({ status: 201, description: 'Log entry created' })
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  addLog(
    @Param('projectId') projectId: string,
    @Param('partId') partId: string,
    @Body() dto: CreateInventoryLogDto,
    @Req() req: RequestWithUser,
  ) {
    const createdById = req.user.id;
    return this.inventoryService.addLog(projectId, partId, dto, createdById);
  }

  @Patch('parts/:partId')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  @ApiOperation({ summary: 'Update part fields' })
  updatePart(
    @Param('projectId') projectId: string,
    @Param('partId') partId: string,
    @Body() dto: UpdatePartDto,
  ) {
    return this.inventoryService.updatePart(projectId, partId, dto)
  }

  @Get('parts/:partId/logs')
  @ApiOperation({ summary: 'Get part logs' })
  @ApiResponse({ status: 200, description: 'Returns logs for part' })
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  @ApiQuery({ name: 'page', required: false, schema: { type: 'integer', minimum: 1 } })
  @ApiQuery({ name: 'pageSize', required: false, schema: { type: 'integer', minimum: 1, maximum: 100 } })
  getLogs(@Param('projectId') projectId: string, @Param('partId') partId: string, @Query() query: any) {
    return this.inventoryService.getLogs(projectId, partId, query);
  }

  @Get('groups')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  @ApiOperation({ summary: 'List part groups' })
  listGroups(@Param('projectId') projectId: string) {
    return this.inventoryService.listGroups(projectId)
  }

  @Post('groups')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  @ApiOperation({ summary: 'Create part group' })
  createGroup(@Param('projectId') projectId: string, @Body() dto: CreatePartGroupDto) {
    return this.inventoryService.createGroup(projectId, dto)
  }

  @Post('groups/:groupId')
  @UseGuards(JwtAuthGuard, ProjectAccessGuard)
  @ApiOperation({ summary: 'Update part group' })
  updateGroup(@Param('projectId') projectId: string, @Param('groupId') groupId: string, @Body() dto: UpdatePartGroupDto) {
    return this.inventoryService.updateGroup(projectId, groupId, dto)
  }
}
