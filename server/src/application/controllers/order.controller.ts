import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from '../../core/application/services/order.service';
import { Order } from '../../core/domain/entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderData: Order): Promise<Order> {
    return this.orderService.createOrder(
      orderData.items,
      orderData.customerId,
      orderData.status,
      orderData.customer_email,
      orderData.deliveryInfo,
      orderData.cardToken,
      orderData.lastFourDigits,
      orderData.transaction,
    );
  }
}
