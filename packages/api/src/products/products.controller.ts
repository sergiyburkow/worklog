import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectMemberGuard } from './guards/project-member.guard';

import {
  ProductResponseDto,
  TaskLogResponseDto,
  CreateProductDto,
  CreateTaskLogDto,
  CheckProductResponseDto,
} from './dto';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products', type: [ProductResponseDto] })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get products by project id' })
  @ApiResponse({ status: 200, description: 'Return products by project id', type: [ProductResponseDto] })
  async findByProject(@Param('projectId') projectId: string) {
    return this.productsService.findByProject(projectId);
  }

  @Get('check/:productCode/project/:projectId')
  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Перевірити продукт в проекті' })
  @ApiResponse({ status: 200, description: 'Результат перевірки продукту', type: CheckProductResponseDto })
  @ApiQuery({ name: 'taskId', required: false, description: 'ID задачі для перевірки' })
  async checkProductInProject(
    @Param('productCode') productCode: string,
    @Param('projectId') projectId: string,
    @Query('taskId') taskId?: string,
  ) {
    return this.productsService.checkProductInProject(productCode, projectId, taskId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Return product by id', type: ProductResponseDto })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, description: 'Product has been created', type: ProductResponseDto })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product has been deleted' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('project/:projectId/products/by-code/:code')
  @UseGuards(ProjectMemberGuard)
  @ApiOperation({ summary: 'Знайти продукт за кодом в проекті' })
  @ApiResponse({ status: 200, description: 'Знайдений продукт', type: ProductResponseDto })
  async findByCode(
    @Param('projectId') projectId: string,
    @Param('code') code: string,
  ) {
    return this.productsService.findByCode(projectId, code);
  }
}
