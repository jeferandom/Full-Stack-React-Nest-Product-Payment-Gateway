import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderController } from './adapters/controllers/order.controller';
import { OrderService } from './services/order.service';
import { ORDER_REPOSITORY } from './domain/ports/order.repository';
import { OrderRepositoryImpl } from './adapters/db/order.repository.impl';
import { ProductController } from './adapters/controllers/product.controller';
import { ProductService } from './services/product.service';
import { PRODUCT_REPOSITORY } from './domain/ports/product.repository';
import { PostgresProductRepositoryImpl } from './adapters/db/postgres.product.repository.impl';
import { MongoProductRepositoryImpl } from './adapters/db/mongo.product.repository.impl';

@Module({
  imports: [],
  controllers: [AppController, OrderController, ProductController],
  providers: [
    AppService,
    OrderService,
    ProductService,
    { provide: ORDER_REPOSITORY, useClass: OrderRepositoryImpl },
    {
      provide: PRODUCT_REPOSITORY,
      useClass:
        process.env.DB_TYPE === 'postgres'
          ? PostgresProductRepositoryImpl
          : MongoProductRepositoryImpl,
    },
  ],
})
export class AppModule {}
