import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductView } from './ProductView';

describe('ProductView', () => {
    it('should show error message when error is present', () => {
        const errorMessage = 'Test error message';
        render(<ProductView loading={false} error={errorMessage} product={null} />);
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    it('should show "Product not found" when product is null', () => {
        render(<ProductView loading={false} error={null} product={null} />);
        expect(screen.getByText('Product not found')).toBeInTheDocument();
    });

    it('should render Product component when product data is available', () => {
        const mockProduct = {
            productId: 'test-123',
            name: 'Test Product',
            price: 99.99,
            description: 'Test Description',
            image: 'test.jpg',
            unitsInStock: 5
        };

        render(<ProductView loading={false} error={null} product={mockProduct} />);
        expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
        expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    });

    it('should sanitize error messages', () => {
        const maliciousError = '<script>alert("xss")</script>Evil message';
        render(<ProductView loading={false} error={maliciousError} product={null} />);

        // The script tag should be stripped out
        expect(screen.getByText('Error: Evil message')).toBeInTheDocument();
        expect(screen.queryByText(/<script>/)).not.toBeInTheDocument();
    });
});
