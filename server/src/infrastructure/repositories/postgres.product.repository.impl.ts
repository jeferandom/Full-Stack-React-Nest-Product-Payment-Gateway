import { Injectable } from '@nestjs/common';
import { PostgresProductRepository } from '../../domain/ports/product.repository';
import { Product } from '../../domain/product.entity';

@Injectable()
export class PostgresProductRepositoryImpl
  implements PostgresProductRepository
{
  async create(product: Product): Promise<Product> {
    console.log(
      'PostgreSQL: Creating product (temporary implementation)',
      product,
    );
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    console.log(
      'PostgreSQL: Finding product by ID (temporary implementation)',
      id,
    );
    return null;
  }

  async seed(): Promise<Product[]> {
    console.log('PostgreSQL: Seeding products (temporary implementation)');
    return [];
  }
}
