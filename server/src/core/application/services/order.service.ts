import { Injectable, Inject } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import {
  OrderRepository,
  ORDER_REPOSITORY,
} from '../../../core/domain/interfaces/secondary/order.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(
    items: { id: string; quantity: number }[],
    customerId: string,
    status: string,
    deliveryInfo: { address: string; city: string; country: string },
    cardToken: string,
    lastFourDigits: string,
    transaction?: {
      id: string;
      created_at: string;
      amount_in_cents: number;
      reference: string;
      customer_email: string;
      currency: string;
      status: string;
      status_message: string;
      redirect_url: string;
    },
  ): Promise<Order> {
    const order = new Order(
      Math.random().toString(),
      items,
      customerId,
      status,
      deliveryInfo,
      new Date(),
      cardToken,
      lastFourDigits,
      0,
      transaction,
    );
    order.calculateTotal();
    console.log('Creating order:', order); // Log para verificar
    await this.orderRepository.create(order);
    return order;
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }
}
