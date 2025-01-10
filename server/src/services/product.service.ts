import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import {
  ProductRepository,
  PRODUCT_REPOSITORY,
} from '../domain/ports/product.repository';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async getProduct(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}
