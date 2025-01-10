import { Injectable, Inject } from '@nestjs/common';
import { Order } from '../../domain/order.entity';
import {
  OrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/ports/order.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(items: string[]): Promise<Order> {
    const order = new Order(Math.random().toString(), items, 0);
    order.calculateTotal();
    await this.orderRepository.save(order);
    return order;
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }
}
