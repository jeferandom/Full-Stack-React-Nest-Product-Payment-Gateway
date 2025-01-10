import { Product } from '../product.entity';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

// Interfaces específicas para PostgreSQL y MongoDB
export interface PostgresProductRepository extends ProductRepository {}
export interface MongoProductRepository extends ProductRepository {}
