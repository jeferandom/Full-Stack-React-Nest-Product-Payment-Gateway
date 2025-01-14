import { describe, it, expect, beforeEach, vi } from "vitest";
import { getProduct } from "./productService";

describe("productService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset fetch mock between tests
    global.fetch = vi.fn();
  });

  it("should successfully fetch a product", async () => {
    const mockProduct = {
      productId: "test-123",
      name: "Test Product",
      price: 99.99,
      description: "Test Description",
      image: "test.jpg",
      unitsInStock: 5,
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    });

    const result = await getProduct("test-123");
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockProduct);
  });

  it("should reject invalid product IDs", async () => {
    const result = await getProduct("invalid@id");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error.statusCode).toBe(400);
    expect(result.error.code).toBe("INVALID_INPUT");
  });

  it("should handle API errors", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: () => Promise.resolve("Product not found"),
    });

    const result = await getProduct("test-123");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error.statusCode).toBe(404);
    expect(result.error.code).toBe("API_ERROR");
  });

  it("should handle network errors", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

    const result = await getProduct("test-123");
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error.statusCode).toBe(500);
    expect(result.error.code).toBe("UNKNOWN_ERROR");
  });

  it("should handle abort signals", async () => {
    const abortController = new AbortController();
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new DOMException("Aborted", "AbortError"));

    try {
      await getProduct("test-123", abortController.signal);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.name).toBe("AbortError");
    }
  });
});
