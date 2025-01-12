import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Product from './Product'

describe('Product', () => {
    it('renders product name', () => {
        const product = {
            productId: '1',
            name: 'Test Product',
            price: 99.99,
            description: 'Test Description',
            image: 'invalid-image.jpg',
            unitsInStock: 5
        };
        render(<Product product={product} />)
        expect(screen.getByText(/Test Product/i)).toBeInTheDocument()
    })
})
it('shows placeholder when image fails to load', async () => {
    const product = {
        productId: '1',
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
        image: 'invalid-image.jpg',
        unitsInStock: 5
    };

    render(<Product product={product} />);
    const img = screen.getByRole('img');
    fireEvent.error(img);

    expect(screen.getByText('Image not available')).toBeInTheDocument();
    expect(img).not.toBeInTheDocument();
});

it('renders all product details correctly', () => {
    const product = {
        productId: '1',
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
        image: 'test.jpg',
        unitsInStock: 5
    };

    render(<Product product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Stock: 5')).toBeInTheDocument();
});

it('applies custom className when provided', () => {
    const product = {
        productId: '1',
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
        image: 'test.jpg',
        unitsInStock: 5
    };

    render(<Product product={product} className="custom-class" />);
    expect(screen.getByRole('img').parentElement?.parentElement)
        .toHaveClass('product-container', 'custom-class');
});

it('renders custom actions when renderActions prop is provided', () => {
    const product = {
        productId: '1',
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
        image: 'test.jpg',
        unitsInStock: 5
    };

    render(
        <Product
            product={product}
            renderActions={() => <button>Test Action</button>}
        />
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Test Action');
});