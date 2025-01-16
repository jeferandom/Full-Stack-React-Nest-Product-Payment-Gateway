import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaymentFormPage from './PaymentFormPage';

describe('PaymentFormPage', () => {
    it('should render the title "Paga con tu tarjeta"', () => {
        render(<PaymentFormPage />);
        expect(screen.getByText('Paga con tu tarjeta')).toBeInTheDocument();
    });
});
