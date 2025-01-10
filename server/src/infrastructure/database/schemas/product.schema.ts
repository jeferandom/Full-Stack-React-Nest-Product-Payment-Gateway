import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema(/*{ timestamps: true }*/)
export class Product {
  @Prop({ required: true, unique: true })
  productId: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  image: string;

  @Prop({ required: true })
  unitsInStock: number;

  @Prop({ required: true })
  unitsOnOrder: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
