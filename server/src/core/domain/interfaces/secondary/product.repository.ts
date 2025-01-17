import { Product } from '../../entities/product.entity';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  seed(): Promise<Product[]>;
  findAll(): Promise<Product[]>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
