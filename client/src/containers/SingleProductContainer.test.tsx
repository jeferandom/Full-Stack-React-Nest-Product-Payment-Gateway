import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SingleProductContainer from './SingleProductContainer';
import { useProduct } from '../hooks/product/useProduct';

// Mock the useProduct hook
vi.mock('../hooks/product/useProduct');

describe('SingleProductContainer', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should show loading state', () => {
        (useProduct as any).mockReturnValue({
            loading: true,
            product: null,
            error: null
        });

        render(<SingleProductContainer productId="test-123" />);
        expect(screen.getByTestId('loading-text')).toBeInTheDocument();
    });

    it('should show error message when fetch fails', () => {
        const errorMessage = 'Failed to fetch product';
        (useProduct as any).mockReturnValue({
            loading: false,
            product: null,
            error: errorMessage
        });

        render(<SingleProductContainer productId="test-123" />);
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    it('should show product details when fetch succeeds', () => {
        const mockProduct = {
            productId: 'test-123',
            name: 'Test Product',
            price: 99.99,
            description: 'Test Description',
            image: 'test.jpg',
            unitsInStock: 5
        };

        (useProduct as any).mockReturnValue({
            loading: false,
            product: mockProduct,
            error: null
        });

        render(<SingleProductContainer productId="test-123" />);
        expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
        expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    });

    it('should show "Product not found" when product is null', () => {
        (useProduct as any).mockReturnValue({
            loading: false,
            product: null,
            error: null
        });

        render(<SingleProductContainer productId="test-123" />);
        expect(screen.getByText('Product not found')).toBeInTheDocument();
    });
});
