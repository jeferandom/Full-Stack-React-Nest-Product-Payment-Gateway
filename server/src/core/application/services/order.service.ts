import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Order } from '../../domain/entities/order.entity';
import {
  OrderRepository,
  ORDER_REPOSITORY,
} from '../../../core/domain/interfaces/secondary/order.repository';
import { createHash } from 'crypto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    private readonly configService: ConfigService,
  ) {}

  generateReference(): string {
    return Math.random().toString(36).substring(2, 18);
  }

  generateSignature(
    reference: string,
    totalAmount: number,
    currency: string,
  ): string {
    const integrityKey = this.configService.get<string>(
      'PAYMENT_GATEWAY_INTEGRITY_KEY',
    );
    const concatenatedString = `${reference}${totalAmount}${currency}${integrityKey}`;
    return createHash('sha256').update(concatenatedString).digest('hex');
  }

  async createOrder(
    items: { id: string; quantity: number }[],
    customerId: string,
    status: string,
    customer_email: string,
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
      customer_email,
      deliveryInfo,
      new Date(),
      cardToken,
      lastFourDigits,
      0,
      transaction,
    );
    await this.orderRepository.create(order);
    return order;
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }
}
