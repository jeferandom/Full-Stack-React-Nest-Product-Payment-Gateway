import { PageLayout } from './layouts/PageLayout';
import ProductsContainer from '../containers/ProductsContainer';

const ProductsPage = () => {
    return (
        <PageLayout title="Productos">
            <ProductsContainer />
        </PageLayout>
    );
};

export default ProductsPage;
