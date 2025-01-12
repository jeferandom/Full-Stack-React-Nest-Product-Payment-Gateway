import React, { useState } from 'react';

interface ProductProps {
    product: {
        productId: string;
        name: string;
        price: number;
        description: string;
        image: string;
        unitsInStock: number;
    },
    renderActions?: () => React.ReactNode;
    className?: string;
}

const Product: React.FC<ProductProps> = ({
    product,
    renderActions,
    className = ''
}) => {
    const [imageError, setImageError] = useState(false);
    return (
        <div className={`product-container ${className}`}>
            <div className="product-image-wrapper">
                {!imageError ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                        width="300"
                        height="300"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="product-image-placeholder">
                        Image not available
                    </div>
                )}
            </div>
            <div className="product-details">
                <h2>{product.name}</h2>
                <p className="price">${product.price}</p>
                <p>{product.description}</p>
                <p className="stock">Stock: {product.unitsInStock}</p>
            </div>
            {renderActions && (
                <div className="product-actions">
                    {renderActions()}
                </div>
            )}
        </div>
    );
}

export default Product;
