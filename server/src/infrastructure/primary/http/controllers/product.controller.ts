import { Controller, Post, Get, Param } from '@nestjs/common';

import { ProductService } from '../../../../core/application/services/product.service';

import { Product } from '../../../../core/domain/entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<Product | null> {
    return this.productService.getProduct(id);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Post('populate')
  async populateProductsDatabase(): Promise<Product[]> {
    return this.productService.seed();
  }
}
