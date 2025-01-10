import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/ports/product.repository';
import { Product } from '../../domain/product.entity';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  private products: Map<string, Product> = new Map();

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }
}
