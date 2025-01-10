import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoProductRepository } from '../../domain/ports/product.repository';
import { Product as ProductEntity } from '../../domain/product.entity';
import {
  Product as ProductSchema,
  ProductDocument,
} from './schemas/product.schema';

@Injectable()
export class MongoProductRepositoryImpl implements MongoProductRepository {
  constructor(
    @InjectModel(ProductSchema.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async findById(id: string): Promise<ProductEntity | null> {
    try {
      const product = await this.productModel
        .findOne({ productId: id })
        .lean()
        .exec();
      if (!product) return null;
      return new ProductEntity(
        product.productId,
        product.name,
        product.price,
        product.description,
        product.image,
        product.unitsInStock,
        product.unitsOnOrder,
      );
    } catch (error) {
      throw new Error(`Error finding product: ${error.message}`);
    }
  }
}
