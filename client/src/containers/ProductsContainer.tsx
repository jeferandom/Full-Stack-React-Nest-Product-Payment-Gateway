import React from 'react';
import { useProducts } from '../hooks/product/useProducts';
import { ProductsView } from '../views/ProductsView';

const ProductsContainer: React.FC = () => {
    const { loading, products, error } = useProducts();
    return <ProductsView loading={loading} products={products} error={error} />;
};

export default ProductsContainer;
