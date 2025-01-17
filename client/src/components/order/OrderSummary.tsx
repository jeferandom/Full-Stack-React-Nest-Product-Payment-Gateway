import React from 'react';
import { OrderItemPopulated } from '../../hooks/order/useOrderSummary';
import { PaymentInfo, DeliveryInfo } from '../../types';
interface OrderSummaryProps {
    orderItems: OrderItemPopulated[];
    paymentInfo: PaymentInfo;
    deliveryInfo: DeliveryInfo;
}
const OrderSummary: React.FC<OrderSummaryProps> = ({ orderItems, deliveryInfo }) => {


    return (
        <>
            <h2>Información de envío</h2>
            <p>Dirección: {deliveryInfo.address}</p>
            <h2>Información de pago</h2>
            <ul>
                {orderItems.map((item, index) => (
                    <li key={index}>
                        {item.name} - {item.quantity} x ${item.price}
                    </li>
                ))}
            </ul>
            <strong>
                <p>Total: ${orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</p>
            </strong>

        </>
    );
}

export default OrderSummary;