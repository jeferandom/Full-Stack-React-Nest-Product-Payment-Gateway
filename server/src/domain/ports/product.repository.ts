import { Product } from '../product.entity';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  seed(): Promise<Product[]>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface PostgresProductRepository extends ProductRepository {}
export interface MongoProductRepository extends ProductRepository {}
