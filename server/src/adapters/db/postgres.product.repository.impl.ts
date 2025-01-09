import { Injectable } from '@nestjs/common';
import { PostgresProductRepository } from '../../domain/ports/product.repository';
import { Product } from '../../domain/product.entity';

@Injectable()
export class PostgresProductRepositoryImpl
  implements PostgresProductRepository
{
  // Implementación específica para PostgreSQL
  async save(product: Product): Promise<void> {
    // Lógica para guardar el producto en PostgreSQL
  }

  async findById(id: string): Promise<Product | null> {
    // Lógica para encontrar el producto por ID en PostgreSQL
    return null;
  }
}
