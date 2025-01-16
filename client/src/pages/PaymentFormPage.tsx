import React from 'react';
import { PageLayout } from './layouts/PageLayout';
import PaymentFormContainer from '../containers/PaymentFormContainer';

const PaymentFormPage: React.FC = () => {
    return (
        <PageLayout title="Paga con tu tarjeta">
            <PaymentFormContainer />
        </PageLayout>
    );
};

export default PaymentFormPage;
