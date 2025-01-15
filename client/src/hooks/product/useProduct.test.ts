import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProduct } from "./useProduct";
import * as productService from "../../services/productService";

// Mock del servicio
vi.mock("../../services/productService", () => ({
  getProduct: vi.fn(),
}));

describe("useProduct", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should start with loading state", () => {
    const { result } = renderHook(() => useProduct("123"));

    expect(result.current.loading).toBe(true);
    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should load product successfully", async () => {
    const mockProduct = {
      productId: "123",
      name: "Test Product",
      price: 99.99,
      description: "Test Description",
      image: "test.jpg",
      unitsInStock: 5,
    };

    vi.mocked(productService.getProduct).mockResolvedValueOnce({
      success: true,
      data: mockProduct,
    });

    const { result } = renderHook(() => useProduct("123"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(mockProduct);
    expect(result.current.error).toBeNull();
  });

  it("should handle undefined productId", async () => {
    const { result } = renderHook(() => useProduct(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Product ID is required");
    expect(result.current.product).toBeNull();
  });

  it("should handle API error", async () => {
    const errorMessage = "API Error";
    vi.mocked(productService.getProduct).mockResolvedValueOnce({
      success: false,
      error: {
        message: errorMessage,
        statusCode: 500,
        code: "API_ERROR",
        name: "ApiError",
      },
    });

    const { result } = renderHook(() => useProduct("123"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.product).toBeNull();
  });
});
