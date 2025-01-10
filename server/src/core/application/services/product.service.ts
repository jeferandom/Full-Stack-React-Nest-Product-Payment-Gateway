import { Injectable, Inject } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  ProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../core/domain/interfaces/secondary/product.repository';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async getProduct(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async seed(): Promise<Product[]> {
    return this.productRepository.seed();
  }
}
