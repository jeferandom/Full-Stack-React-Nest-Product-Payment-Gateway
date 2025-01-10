import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoProductRepository } from '../../domain/ports/product.repository';
import { Product as ProductEntity } from '../../domain/product.entity';
import { dummyProducts } from '../seeder/dummy_products';

import {
  Product as ProductSchema,
  ProductDocument,
} from '../database/schemas/product.schema';

@Injectable()
export class MongoProductRepositoryImpl implements MongoProductRepository {
  constructor(
    @InjectModel(ProductSchema.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async clear(): Promise<void> {
    await this.productModel.deleteMany({});
  }

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

  async seed(): Promise<ProductEntity[]> {
    const seededProducts: ProductEntity[] = [];
    await this.clear();
    for (const productData of dummyProducts) {
      if (!productData.productId) {
        console.error(
          `Product ID is null for product: ${JSON.stringify(productData)}`,
        );
        continue;
      }
      const existingProduct = await this.findById(productData.productId);
      if (existingProduct) {
        console.log(
          `Product with ID ${productData.productId} already exists. Skipping.`,
        );
        continue;
      }
      const product = new ProductEntity(
        productData.productId,
        productData.name,
        productData.price,
        productData.description,
        productData.image,
        productData.unitsInStock,
        productData.unitsOnOrder,
      );

      await this.create(product);
      seededProducts.push(product);
    }
    return seededProducts;
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    try {
      const createdProduct = await this.productModel.create({
        productId: product.productId,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        unitsInStock: product.unitsInStock,
        unitsOnOrder: product.unitsOnOrder,
      });

      return new ProductEntity(
        createdProduct.productId,
        createdProduct.name,
        createdProduct.price,
        createdProduct.description,
        createdProduct.image,
        createdProduct.unitsInStock,
        createdProduct.unitsOnOrder,
      );
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }
}
