import { useState, useEffect } from "react";
import {
  getProducts,
  Product as ProductType,
} from "../../services/productService";

export const useProducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProducts = async () => {
      setError(null);
      try {
        setLoading(true);
        const result = await getProducts(abortController.signal);

        if (result.success) {
          setProducts(result.data);
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

    fetchProducts();
    return () => abortController.abort();
  }, []);

  return { loading, products, error };
};
