import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { MongooseModule } from '@nestjs/mongoose';

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
  ],
  controllers: [AppController, OrderController, ProductController],
  providers: [
    AppService,
    OrderService,
    ProductService,
    { provide: ORDER_REPOSITORY, useClass: OrderRepositoryImpl },
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (configService: ConfigService) => {
        return configService.get('DB_TYPE') === 'postgres'
          ? new PostgresProductRepositoryImpl()
          : new MongoProductRepositoryImpl();
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
