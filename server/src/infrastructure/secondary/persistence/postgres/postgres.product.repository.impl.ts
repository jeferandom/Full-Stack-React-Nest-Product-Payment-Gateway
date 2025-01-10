import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../../../core/domain/interfaces/secondary/product.repository';
import { Product } from '../../../../core/domain/entities/product.entity';

@Injectable()
export class PostgresProductRepositoryImpl implements ProductRepository {
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
