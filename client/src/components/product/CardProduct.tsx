import { useState } from 'react';
import { ProductType } from './Product';

interface CardProductProps {
    product: ProductType;
    renderActions?: () => React.ReactNode;
    className?: string;
}

export const CardProduct: React.FC<CardProductProps> = ({ product, renderActions, className }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div className={`card-product ${className || ''}`}>
            <div className="card-product-image-wrapper">
                {!imageError ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        width="250"
                        height="250"
                        className="card-product-image"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="card-product-image-placeholder">
                        <img
                            src="/src/assets/placeholder.webp"
                            alt="Placeholder"
                            className="placeholder-image"
                            width="250"
                            height="250"
                        />
                        <span className="sr-only" data-testid="placeholder-text">Image not available</span>
                    </div>
                )}
            </div>
            <div className="card-product-content">
                <h3 className="card-product-title">{product.name}</h3>
                <p className="card-product-price">${product.price}</p>
                {renderActions && <div className="card-product-actions">{renderActions()}</div>}
            </div>
        </div>
    );
};
