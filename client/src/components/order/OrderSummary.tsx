import React from 'react';
import { OrderItemPopulated } from '../../hooks/order/useOrderSummary';
import { PaymentInfo, DeliveryInfo } from '../../types';
interface OrderSummaryProps {
    orderItems: OrderItemPopulated[];
    paymentInfo: PaymentInfo;
    deliveryInfo: DeliveryInfo;
    createOrder: () => void;
}
const OrderSummary: React.FC<OrderSummaryProps> = ({ orderItems, deliveryInfo, createOrder }) => {


    return (
        <>
            <h3>Información de envío</h3>
            <p>Dirección: {deliveryInfo.address}</p>
            <h3>Información de pago</h3>
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

            <button
                onClick={() => {
                    createOrder();
                }}
            >Confirmar compra</button>

        </>
    );
}

export default OrderSummary;