import React from 'react';
import { useOrderSummary } from '../hooks/order/useOrderSummary.ts';
import { OrderSummaryView } from '../views/OrderSummaryView';

const OrderSummaryContainer: React.FC = () => {
    const {
        loading,
        orderItems,
        paymentInfo,
        deliveryInfo,
        error,
        createOrder,
        transactionStatus
    } = useOrderSummary();
    return <OrderSummaryView
        error={error}
        loading={loading}
        orderItems={orderItems}
        paymentInfo={paymentInfo}
        deliveryInfo={deliveryInfo}
        createOrder={createOrder}
        transactionStatus={transactionStatus}
    />;
};

export default OrderSummaryContainer;