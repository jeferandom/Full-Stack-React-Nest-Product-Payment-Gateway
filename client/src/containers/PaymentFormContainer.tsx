import React from 'react';
import { usePaymentForm } from '../hooks/payment/usePaymentForm';
import { PaymentFormView } from '../views/PaymentFormView';


const PaymentFormContainer: React.FC = () => {
    const {
        loading,
        paymentInfo,
        deliveryInfo,
        error
    } = usePaymentForm();
    return <PaymentFormView loading={loading} paymentForm={{ paymentInfo, deliveryInfo }} error={error} />;
};

export default PaymentFormContainer;
