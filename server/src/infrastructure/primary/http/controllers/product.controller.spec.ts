import { ProductController } from './product.controller';
import { ProductService } from '../../../../core/application/services/product.service';
import { ProductRepository } from '../../../../core/domain/interfaces/secondary/product.repository';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      seed: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    productService = new ProductService(productRepository);
    productController = new ProductController(productService);
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const result = {
        productId: '2',
        name: 'Product 2',
        price: 20000,
        description: 'Product 2 description',
        image: 'https://via.placeholder.com/150',
        unitsInStock: 20,
        unitsOnOrder: 0,
      };
      jest.spyOn(productService, 'getProduct').mockResolvedValue(result);

      expect(await productController.getProduct('1')).toBe(result);
    });
  });
});
