import { render } from '@testing-library/react';
import { describe, expect, it } from "vitest";
import PaymentForm from './PaymentForm';

describe('PaymentForm Component', () => {
    const mockProps = {
        paymentInfo: {
            number: "4242424242424242",
            cvc: "123",
            exp_month: "08",
            exp_year: "28",
            card_holder: "Jef Mance",
            customer_email: "jef@example.com",
            id_type: "01",
            id_number: "123456789",
            installments: 1,
        },
        deliveryInfo: {
            address: "Calle 123",
            country: "CO",
            city: "Bogota",
        },
        orderItems: [
            {
                id: "1",
                quantity: 1,
            },
            {
                id: "2",
                quantity: 2,
            },
        ],
    };

    it('should render card number and card holder', () => {
        const { getByDisplayValue } = render(<PaymentForm {...mockProps} />);

        expect(getByDisplayValue(/4242424242424242/)).toBeInTheDocument();
        expect(getByDisplayValue(/Jef Mance/)).toBeInTheDocument();
    });

});
