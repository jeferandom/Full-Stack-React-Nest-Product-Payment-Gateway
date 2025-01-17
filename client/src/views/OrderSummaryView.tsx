import { Backdrop, CircularProgress } from '@mui/material';
import purify from 'dompurify';
import OrderSummary from '../components/order/OrderSummary';
import { OrderItemPopulated } from '../hooks/order/useOrderSummary';
import { PaymentInfo, DeliveryInfo } from "../types";

interface OrderSummaryViewProps {
    loading?: boolean;
    error?: string | null;
    orderItems: OrderItemPopulated[];
    paymentInfo: PaymentInfo;
    deliveryInfo: DeliveryInfo;
}

export const OrderSummaryView: React.FC<OrderSummaryViewProps> = ({ loading, error, orderItems, paymentInfo,
    deliveryInfo }) => {

    if (loading) {
        return (
            <Backdrop open={true} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
                <CircularProgress color="inherit" />
                <span className="sr-only" data-testid="loading-text">loading</span>
            </Backdrop>
        );
    }

    if (error) {
        return (
            <div>Error: {purify.sanitize(error)}</div>
        );
    }

    if (orderItems.length < 1) {
        return (
            <div>No order items found</div>
        );
    }   

    return (
        <OrderSummary orderItems={orderItems} paymentInfo={paymentInfo} deliveryInfo={deliveryInfo} />
    );
};