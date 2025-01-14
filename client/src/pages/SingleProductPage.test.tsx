import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SingleProductPage from './SingleProductPage';
import * as router from 'react-router';

// Mock de los módulos necesarios
vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useParams: vi.fn()
    };
});

describe('SingleProductPage', () => {
    it('should show error when productId is missing', () => {
        vi.mocked(router.useParams).mockReturnValue({ productId: undefined });

        render(<SingleProductPage />);

        expect(screen.getByText('Product ID is required')).toBeInTheDocument();
    });
});
