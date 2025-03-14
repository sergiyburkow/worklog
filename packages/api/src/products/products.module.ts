import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectMemberGuard } from './guards/project-member.guard';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProjectMemberGuard],
  exports: [ProductsService],
})
export class ProductsModule {} 