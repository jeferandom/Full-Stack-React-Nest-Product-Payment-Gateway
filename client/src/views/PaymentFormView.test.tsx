import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PaymentFormView } from './PaymentFormView';

describe('PaymentFormView', () => {
    it('should show error message when error is present', () => {
        const errorMessage = 'Test error message';
        render(<PaymentFormView loading={false} error={errorMessage} />);
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    // should datat-testid "loading-test" show loading text
    it('should show loading text when loading is true', () => {
        render(<PaymentFormView loading={true} error={null} />);
        expect(screen.getByTestId('loading-text')).toBeInTheDocument();
    });


    it('should render PaymentForm component when form data is available', () => {
        const mockProps = {
            paymentForm: {
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
                        id: 'test-123',
                        quantity: 1
                    }
                ]
            }
        };


        render(<PaymentFormView {...mockProps} />);
        expect(screen.getByDisplayValue(/4242424242424242/)).toBeInTheDocument();
    });

    it('should sanitize error messages', () => {
        const maliciousError = '<script>alert("xss")</script>Evil message';
        render(<PaymentFormView loading={false} error={maliciousError} />);

        // The script tag should be stripped out
        expect(screen.getByText('Error: Evil message')).toBeInTheDocument();
        expect(screen.queryByText(/<script>/)).not.toBeInTheDocument();
    });
});
