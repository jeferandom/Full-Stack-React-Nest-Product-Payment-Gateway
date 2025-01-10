import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema(/*{ timestamps: true }*/)
export class Product {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Add compound index for potential name/price queries
ProductSchema.index({ name: 1, price: 1 });
