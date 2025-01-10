import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './infrastructure/adapters/controllers/http/order.controller';
import { OrderService } from './application/services/order.service';
import { ORDER_REPOSITORY } from './domain/ports/order.repository';
import { OrderRepositoryImpl } from './infrastructure/repositories/order.repository.impl';
import { ProductController } from './infrastructure/adapters/controllers/http/product.controller';
import { ProductService } from './application/services/product.service';
import { PRODUCT_REPOSITORY } from './domain/ports/product.repository';
import { PostgresProductRepositoryImpl } from './infrastructure/repositories/postgres.product.repository.impl';
import { MongoProductRepositoryImpl } from './infrastructure/repositories/mongo.product.repository.impl';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductSchema,
  ProductDocument,
} from './infrastructure/database/schemas/product.schema';
import { getModelToken } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('DB_URI_MONGO')}/${configService.get('DB_NAME_MONGO')}`,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [AppController, OrderController, ProductController],
  providers: [
    AppService,
    OrderService,
    ProductService,
    { provide: ORDER_REPOSITORY, useClass: OrderRepositoryImpl },
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        productModel: Model<ProductDocument>,
      ) => {
        return configService.get('DB_TYPE') === 'postgres'
          ? new PostgresProductRepositoryImpl()
          : new MongoProductRepositoryImpl(productModel);
      },
      inject: [ConfigService, getModelToken(Product.name)],
    },
  ],
})
export class AppModule {}
