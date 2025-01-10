import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './infrastructure/primary/http/controllers/app.controller';
import { OrderController } from './infrastructure/primary/http/controllers/order.controller';
import { ProductController } from './infrastructure/primary/http/controllers/product.controller';

import { MongoProductRepositoryImpl } from './infrastructure/secondary/persistence/mongodb/mongo.product.repository.impl';
import { PostgresProductRepositoryImpl } from './infrastructure/secondary/persistence/postgres/postgres.product.repository.impl';
import { OrderRepositoryImpl } from './infrastructure/secondary/persistence/order.repository.impl';

import { OrderService } from './core/application/services/order.service';
import { ProductService } from './core/application/services/product.service';
import { CreditCardApplicationService } from './core/application/services/credit-card.service';
import { CreditCardValidatorService } from './core/domain/services/credit-card-validator.service';

import { AppService } from './app.service';

import { ORDER_REPOSITORY } from './core/domain/interfaces/secondary/order.repository';
import { PRODUCT_REPOSITORY } from './core/domain/interfaces/secondary/product.repository';

import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductSchema,
  ProductDocument,
} from './infrastructure/secondary/persistence/mongodb/schemas/product.schema';
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
    CreditCardValidatorService,
    CreditCardApplicationService,
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
