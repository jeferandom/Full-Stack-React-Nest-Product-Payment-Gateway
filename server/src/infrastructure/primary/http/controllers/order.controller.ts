import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderService } from '../../../../core/application/services/order.service';
import { Order } from '../../../../core/domain/entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderData: Order): Promise<Order> {
    return this.orderService.createOrder(
      orderData.items,
      orderData.customerId,
      orderData.status,
      orderData.deliveryInfo,
      orderData.cardToken,
      orderData.lastFourDigits,
      orderData.transaction,
    );
  }

  @Get(':id')
  async getOrder(@Param('id') id: string): Promise<Order | null> {
    return this.orderService.getOrder(id);
  }
}
