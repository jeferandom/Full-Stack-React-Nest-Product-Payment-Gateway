import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from '../../../../core/application/services/order.service';
import { Order } from '../../../../core/domain/entities/order.entity';
import { PaymentGatewayService } from '../../../secondary/payment-gateway/payment-gateway.service';
import {
  ResponseTransactionPaymentGateway,
  ErrorResponseTransactionPaymentGateway,
} from '../../../../core/domain/interfaces/payment-transaction.interface';
import { ProductService } from '../../../../core/application/services/product.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly productService: ProductService,
  ) {}

  @Post()
  async createOrder(@Body() orderData: Order): Promise<Order> {
    const tokens = await this.paymentGatewayService.getAcceptanceTokens();
    const totalAmount = await this.productService.calculateTotalAmount(
      orderData.items,
    );
    const reference = this.orderService.generateReference();
    const signature = this.orderService.generateSignature(
      reference,
      totalAmount,
      'COP',
    );

    const transaction = await this.paymentGatewayService.createTransaction({
      payment_method: {
        type: 'CARD',
        token: orderData.cardToken,
        installments: 1,
      },
      customer_email: orderData.customer_email,
      acceptance_token: tokens.acceptance_token,
      accept_personal_auth: tokens.accept_personal_auth,
      amount_in_cents: totalAmount,
      currency: 'COP',
      reference: reference,
      signature: signature,
    });

    if ('error' in transaction) {
      throw new BadRequestException(transaction.error.messages);
    }

    const order = await this.orderService.createOrder(
      orderData.items,
      orderData.customerId,
      'PENDING',
      orderData.customer_email,
      orderData.deliveryInfo,
      orderData.cardToken,
      transaction.data.payment_method.extra.last_four,
      {
        id: transaction.data.id,
        created_at: transaction.data.created_at,
        amount_in_cents: transaction.data.amount_in_cents,
        reference: transaction.data.reference,
        customer_email: transaction.data.customer_email,
        currency: transaction.data.currency,
        status: transaction.data.status,
        status_message: transaction.data.status_message,
        redirect_url: transaction.data.redirect_url,
      },
    );

    return order;
  }

  @Get(':id')
  async getOrder(@Param('id') id: string): Promise<Order | null> {
    return this.orderService.getOrder(id);
  }
}
