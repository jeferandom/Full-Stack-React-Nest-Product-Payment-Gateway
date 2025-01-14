import { Result, ApiError } from "../utils/errors";

export interface Product {
  productId: string;
  name: string;
  price: number;
  description: string;
  image: string;
  unitsInStock: number;
}

const API_URL = import.meta.env.VITE_API_URL;

export const getProduct = async (
  productId: string,
  signal?: AbortSignal
): Promise<Result<Product>> => {
  try {
    // Input validation
    if (!productId.match(/^[a-zA-Z0-9-]+$/)) {
      return {
        success: false,
        error: new ApiError(400, "Invalid product ID format", "INVALID_INPUT"),
      };
    }

    const response = await fetch(`${API_URL}/products/${productId}`, {
      signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });

    if (!response.ok) {
      return {
        success: false,
        error: new ApiError(
          response.status,
          (await response.text()) || "Failed to fetch product",
          "API_ERROR"
        ),
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      // Propagar el error de abort para manejo específico
      throw err;
    }
    return {
      success: false,
      error: new ApiError(500, "Internal error", "UNKNOWN_ERROR"),
    };
  }
};
