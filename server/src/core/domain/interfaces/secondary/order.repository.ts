import { Order } from '../../entities/order.entity';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
}

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
