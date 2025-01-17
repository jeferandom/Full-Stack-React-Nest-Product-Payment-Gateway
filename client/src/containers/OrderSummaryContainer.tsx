import React from 'react';
import { useOrderSummary } from '../hooks/order/useOrderSummary.ts';
import { OrderSummaryView } from '../views/OrderSummaryView';

const OrderSummaryContainer: React.FC = () => {
    // const {
    //     loading,
    //     orderSummary,
    //     error,
    // } = useOrderSummary();
    return <OrderSummaryView />;
};

export default OrderSummaryContainer;