import { Injectable } from '@nestjs/common';
import { MongoProductRepository } from '../../domain/ports/product.repository';
import { Product } from '../../domain/product.entity';

@Injectable()
export class MongoProductRepositoryImpl implements MongoProductRepository {
  // Implementación específica para MongoDB
  async save(product: Product): Promise<void> {
    // Lógica para guardar el producto en MongoDB
  }

  async findById(id: string): Promise<Product | null> {
    // Lógica para encontrar el producto por ID en MongoDB
    return null;
  }
}
