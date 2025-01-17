import React from 'react';
import { PageLayout } from './layouts/PageLayout';
import OrderSummaryContainer from '../containers/OrderSummaryContainer';

const OrderSummaryPage: React.FC = () => {
    return (
        <PageLayout title="Resumen de la orden">
            <OrderSummaryContainer />
        </PageLayout>
    );
}

export default OrderSummaryPage;