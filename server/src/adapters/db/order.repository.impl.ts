import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../domain/ports/order.repository';
import { Order } from '../../domain/order.entity';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  private orders: Map<string, Order> = new Map();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }
}
