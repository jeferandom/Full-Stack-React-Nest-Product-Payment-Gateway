import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../domain/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() items: string[]): Promise<Order> {
    return this.orderService.createOrder(items);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string): Promise<Order | null> {
    return this.orderService.getOrder(id);
  }
}
