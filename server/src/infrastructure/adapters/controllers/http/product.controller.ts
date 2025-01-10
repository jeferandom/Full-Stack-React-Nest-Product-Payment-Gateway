import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { ProductService } from '../../../../application/services/product.service';

import { Product } from '../../../../domain/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<Product | null> {
    return this.productService.getProduct(id);
  }

  @Post('populate')
  async populateProductsDatabase(): Promise<Product[]> {
    return this.productService.seed();
  }
}
