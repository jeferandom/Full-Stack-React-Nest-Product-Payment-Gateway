import React from 'react';
import { OrderItemPopulated } from '../../hooks/order/useOrderSummary';
import { PaymentInfo, DeliveryInfo } from '../../types';
interface OrderSummaryProps {
    orderItems: OrderItemPopulated[];
    paymentInfo: PaymentInfo;
    deliveryInfo: DeliveryInfo;
    createOrder: () => void;
    transactionStatus: string | null;
}
const OrderSummary: React.FC<OrderSummaryProps> = ({ orderItems, deliveryInfo, createOrder, transactionStatus }) => {


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

            {transactionStatus && (
                <div>
                    <h3>Estado de la transacción</h3>
                    <p>{transactionStatus}</p>
                </div>
            )}

            <button
                onClick={() => createOrder()}
                disabled={transactionStatus === 'PENDING' || transactionStatus === 'APPROVED'}
            >
                {transactionStatus === 'PENDING' ? 'Procesando...' : 'Confirmar compra'}
            </button>

        </>
    );
}

export default OrderSummary;