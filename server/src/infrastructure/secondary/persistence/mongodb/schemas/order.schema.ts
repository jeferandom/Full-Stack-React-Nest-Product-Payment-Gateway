import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, type: [{ id: String, quantity: Number }] })
  items: { id: string; quantity: number }[];

  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  status: string;
  @Prop({ required: true })
  customer_email: string;
  @Prop({
    required: true,
    type: { address: String, city: String, country: String },
  })
  deliveryInfo: { address: string; city: string; country: string };

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  cardToken: string;

  @Prop({ required: true })
  lastFourDigits: string;

  @Prop({ required: true })
  total: number;

  @Prop({
    required: false,
    type: {
      id: String,
      created_at: String,
      amount_in_cents: Number,
      reference: String,
      customer_email: String,
      currency: String,
      status: String,
      status_message: String,
      redirect_url: String,
    },
  })
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
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export interface Transaction {
  id: string;
  created_at: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  status: string;
  status_message: string;
  redirect_url: string;
}

export interface PaymentInfo {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
  customer_email: string;
  id_type: string;
  id_number: string;
  installments: number;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  country: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
}

export interface CreditCard {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}
