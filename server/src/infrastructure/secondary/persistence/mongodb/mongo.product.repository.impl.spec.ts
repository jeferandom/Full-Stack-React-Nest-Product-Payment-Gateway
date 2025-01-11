import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoProductRepositoryImpl } from './mongo.product.repository.impl';
import { ProductDocument } from '../mongodb/schemas/product.schema';
import { Product as ProductEntity } from '../../../../core/domain/entities/product.entity';

describe('MongoProductRepositoryImpl', () => {
  let repository: MongoProductRepositoryImpl;
  let model: Model<ProductDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoProductRepositoryImpl,
        {
          provide: getModelToken('Product'),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<MongoProductRepositoryImpl>(
      MongoProductRepositoryImpl,
    );
    model = module.get<Model<ProductDocument>>(getModelToken('Product'));
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productData = {
        productId: '1',
        name: 'Product 1',
        price: 10000,
        description: 'Product 1 description',
        image: 'https://via.placeholder.com/150',
        unitsInStock: 10,
        unitsOnOrder: 0,
      };

      const createdProduct = {
        ...productData,
        _id: 'someObjectId',
      };

      jest.spyOn(model, 'create').mockResolvedValue(createdProduct as any);

      const productEntity = new ProductEntity(
        productData.productId,
        productData.name,
        productData.price,
        productData.description,
        productData.image,
        productData.unitsInStock,
        productData.unitsOnOrder,
      );

      const result = await repository.create(productEntity);

      expect(result).toEqual(productEntity);
      expect(model.create).toHaveBeenCalledWith({
        productId: productData.productId,
        name: productData.name,
        price: productData.price,
        description: productData.description,
        image: productData.image,
        unitsInStock: productData.unitsInStock,
        unitsOnOrder: productData.unitsOnOrder,
      });
    });
  });
});
