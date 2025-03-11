import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import {
  ProductResponseDto,
  TaskLogResponseDto,
  CreateProductDto,
  CreateTaskLogDto,
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

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Return product by id', type: ProductResponseDto })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get products by project id' })
  @ApiResponse({ status: 200, description: 'Return products by project id', type: [ProductResponseDto] })
  async findByProject(@Param('projectId') projectId: string) {
    return this.productsService.findByProject(projectId);
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

}
