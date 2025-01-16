import React from 'react';
import { usePaymentForm } from '../hooks/payment/usePaymentForm';
import { PaymentFormView } from '../views/PaymentFormView';


const PaymentFormContainer: React.FC = () => {
    const {
        loading,
        paymentInfo,
        deliveryInfo,
        orderItems,
        error
    } = usePaymentForm([]);
    return <PaymentFormView loading={loading} paymentForm={{ paymentInfo, deliveryInfo, orderItems }} error={error} />;
};

export default PaymentFormContainer;
