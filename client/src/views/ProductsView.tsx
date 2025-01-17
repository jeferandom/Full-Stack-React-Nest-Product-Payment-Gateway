import { Backdrop, CircularProgress } from '@mui/material';
import Product, { ProductType } from '../components/product/Product';
import purify from 'dompurify';
import { useNavigate } from 'react-router';

interface ProductsViewProps {
    loading: boolean;
    error: string | null;
    products: ProductType[];
}

export const ProductsView: React.FC<ProductsViewProps> = ({ loading, error, products }) => {
    const navigate = useNavigate();

    if (loading) {
        return (
            <Backdrop open={true} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
                <CircularProgress color="inherit" />
                <span className="sr-only" data-testid="loading-text">loading</span>
            </Backdrop >
        );
    }

    if (error) {
        return (
            <div>Error: {purify.sanitize(error)}</div>
        );
    }

    if (!products.length) {
        return <div>No products available</div>;
    }

    return (
        <div className="products-grid">
            {products.map((product) => (
                <Product
                    key={product.productId}
                    product={product}
                    className="product-card"
                    renderActions={() => (
                        <button
                            onClick={() => navigate(`/product/${product.productId}`)}
                            className="view-details-button"
                        >
                            View Details
                        </button>
                    )}
                />
            ))}
        </div>
    );
};
