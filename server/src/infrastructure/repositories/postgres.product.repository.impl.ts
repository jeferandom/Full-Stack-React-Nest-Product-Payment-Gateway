import { Injectable } from '@nestjs/common';
import { PostgresProductRepository } from '../../domain/ports/product.repository';
import { Product } from '../../domain/product.entity';

@Injectable()
export class PostgresProductRepositoryImpl
  implements PostgresProductRepository
{

  async findById(id: string): Promise<Product | null> {
    console.log(
      'PostgreSQL: Finding product by ID (temporary implementation)',
      id,
    );
    return null;
  }
}
