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

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async seed(): Promise<Product[]> {
    return this.productRepository.seed();
  }

  async calculateTotalAmount(
    items: { id: string; quantity: number }[],
  ): Promise<number> {
    let totalAmount = 0;
    for (const item of items) {
      const product = await this.getProduct(item.id);
      if (product) {
        totalAmount += product.price * item.quantity * 100;
      }
    }
    return totalAmount;
  }
}
