import React from 'react';
import { useProduct } from '../hooks/product/useProduct';
import { ProductView } from '../views/ProductView';

interface SingleProductContainerProps {
    productId: string;
}

const SingleProductContainer: React.FC<SingleProductContainerProps> = ({ productId }) => {
    const { loading, product, error } = useProduct(productId);
    return <ProductView loading={loading} product={product} error={error} />;
};

export default SingleProductContainer;