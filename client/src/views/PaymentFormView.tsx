import { Backdrop, CircularProgress } from '@mui/material';
import purify from 'dompurify';
import PaymentForm from '../components/payment/PaymentForm';
import { PaymentInfo, DeliveryInfo } from '../types';


interface PaymentFormViewProps {
    loading?: boolean;
    error?: string | null;
    paymentForm?: {
        paymentInfo: PaymentInfo;
        deliveryInfo: DeliveryInfo;
    };
}

export const PaymentFormView: React.FC<PaymentFormViewProps> = ({ loading, error, paymentForm }) => {

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

    if (!paymentForm) {
        return (
            <div>Internal error</div>
        );
    }

    return (
        <PaymentForm {...paymentForm} />
    );
};