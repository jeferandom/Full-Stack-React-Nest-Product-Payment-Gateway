import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from '../../../../core/application/services/order.service';
import { Order } from '../../../../core/domain/entities/order.entity';
import { PaymentGatewayService } from '../../../secondary/payment-gateway/payment-gateway.service';
import { ProductService } from '../../../../core/application/services/product.service';
import { CreditCardApplicationService } from '../../../secondary/credit-card/credit-card.service';

interface OrderWithCardInfo extends Order {
  cardInfo: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  };
}

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly productService: ProductService,
    private readonly creditCardService: CreditCardApplicationService,
  ) {}

  @Post()
  async createOrder(@Body() orderData: OrderWithCardInfo): Promise<Order> {
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

    const cardTokenization = await this.creditCardService.validateAndTokenize({
      number: orderData.cardInfo.number,
      cvc: orderData.cardInfo.cvc,
      exp_month: orderData.cardInfo.exp_month,
      exp_year: orderData.cardInfo.exp_year,
      card_holder: orderData.cardInfo.card_holder,
    });

    if (!cardTokenization.isValid || cardTokenization.error) {
      throw new BadRequestException('Invalid card information');
    }

    const cardToken = cardTokenization.token.data.id;

    const transaction = await this.paymentGatewayService.createTransaction({
      payment_method: {
        type: 'CARD',
        token: cardToken,
        installments: 1,
      },
      customer_email: 'jefmancera@test.com',
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
      'jefmancera@test.com',
      orderData.deliveryInfo,
      cardToken,
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

  @Get('transactions/:id')
  async getTransaction(@Param('id') transactionId: string) {
    const transaction =
      await this.paymentGatewayService.getTransaction(transactionId);

    if ('error' in transaction) {
      throw new BadRequestException(transaction.error.messages);
    }

    return transaction.data;
  }
}
