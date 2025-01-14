import { useParams } from 'react-router';
import { PageLayout } from './layouts/PageLayout';
import SingleProductContainer from '../containers/SingleProductContainer';

const SingleProductPage = () => {
    const { productId } = useParams();

    if (!productId) {
        return (
            <PageLayout title="Error">
                <div>Product ID is required</div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <SingleProductContainer productId={productId} />
        </PageLayout>
    );
};

export default SingleProductPage;