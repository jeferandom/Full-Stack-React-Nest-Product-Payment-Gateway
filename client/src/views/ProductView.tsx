import { Backdrop, CircularProgress } from '@mui/material';
import Product, { ProductType } from '../components/product/Product';
import purify from 'dompurify';
import { Link } from "react-router";


interface ProductViewProps {
    loading: boolean;
    error: string | null;
    product: ProductType | null;
}

export const ProductView: React.FC<ProductViewProps> = ({ loading, error, product }) => {
    if (loading) {
        return (
            <Backdrop open={true} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
                <CircularProgress color="inherit" />
                <span className="sr-only" data-testid="loading-text">loading</span>
            </Backdrop>
        );
    }

    if (error) {
        return (
            <div>Error: {purify.sanitize(error)}</div>
        );
    }

    if (!product) {
        return (
            <div>Product not found</div>
        );
    }
    const PayWithCardButton = () => {
        return (
            <Link to="/payment-form">Paga con Tarjeta</Link>
        );
    }

    return (
        <Product
            product={product}
            renderActions={() => <PayWithCardButton />}
        />
    );
};