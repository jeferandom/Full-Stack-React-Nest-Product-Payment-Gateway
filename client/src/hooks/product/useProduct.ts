import { useState, useEffect } from "react";
import {
  getProduct,
  Product as ProductType,
} from "../../services/productService";

export const useProduct = (productId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProduct = async () => {
      setError(null);
      try {
        if (!productId) throw new Error("Product ID is required");
        setLoading(true);
        const result = await getProduct(productId, abortController.signal);

        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.error.message);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    return () => abortController.abort();
  }, [productId]);

  return { loading, product, error };
};
