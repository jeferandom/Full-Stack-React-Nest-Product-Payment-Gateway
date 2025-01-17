import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderRepository } from '../../../../core/domain/interfaces/secondary/order.repository';
import { Order as OrderEntity } from '../../../../core/domain/entities/order.entity';
import {
  Order as OrderSchema,
  OrderDocument,
} from '../mongodb/schemas/order.schema';

@Injectable()
export class MongoOrderRepositoryImpl implements OrderRepository {
  constructor(
    @InjectModel(OrderSchema.name)
    private orderModel: Model<OrderDocument>,
  ) {}

  async create(order: OrderEntity): Promise<OrderEntity> {
    const createdOrder = await this.orderModel.create(order);
    return new OrderEntity(
      createdOrder.id,
      createdOrder.items,
      createdOrder.customerId,
      createdOrder.status,
      createdOrder.deliveryInfo,
      createdOrder.createdAt,
      createdOrder.cardToken,
      createdOrder.lastFourDigits,
      createdOrder.total,
      createdOrder.transaction,
    );
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await this.orderModel.findOne({ id }).lean().exec();
    if (!order) return null;
    return new OrderEntity(
      order.id,
      order.items,
      order.customerId,
      order.status,
      order.deliveryInfo,
      order.createdAt,
      order.cardToken,
      order.lastFourDigits,
      order.total,
      order.transaction,
    );
  }
}
