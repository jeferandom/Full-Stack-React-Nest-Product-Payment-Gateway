import { Backdrop, CircularProgress } from '@mui/material';
import purify from 'dompurify';
import OrderSummary from '../components/order/OrderSummary';


interface OrderSummaryViewProps {
    loading?: boolean;
    error?: string | null;
}

export const OrderSummaryView: React.FC<OrderSummaryViewProps> = ({ loading, error }) => {

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



    return (
        <OrderSummary />
    );
};