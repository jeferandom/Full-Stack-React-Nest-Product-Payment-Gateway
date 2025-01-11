import { ProductService } from './product.service';
import { ProductRepository } from '../../domain/interfaces/secondary/product.repository';
import { Product } from '../../domain/entities/product.entity';

const mockProduct: Product = {
  productId: '1',
  name: 'Test Product',
  price: 10000,
  description: 'product description',
  image: 'https://via.placeholder.com/150',
  unitsInStock: 10,
  unitsOnOrder: 10,
};

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
      // otros métodos del repositorio...
    } as unknown as jest.Mocked<ProductRepository>;

    productService = new ProductService(productRepository);
  });

  it('should return the product when found', async () => {
    productRepository.findById.mockResolvedValue(mockProduct);

    const result = await productService.getProduct('1');

    expect(result).toEqual(mockProduct);
    expect(productRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should return null when product is not found', async () => {
    productRepository.findById.mockResolvedValue(null);

    const result = await productService.getProduct('1');

    expect(result).toBe(null);
    expect(productRepository.findById).toHaveBeenCalledWith('1');
  });
});
