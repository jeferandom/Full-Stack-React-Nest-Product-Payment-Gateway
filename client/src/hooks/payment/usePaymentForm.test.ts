import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePaymentForm } from "./usePaymentForm";

// Mock del servicio
vi.mock("../../services/paymentService", () => ({
  getProduct: vi.fn(),
}));

describe("usePaymentForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  //start loading
  it("should stop loading", async () => {
    const { result } = renderHook(() =>
      usePaymentForm([
        {
          id: "1",
          quantity: 1,
        },
      ])
    );

    expect(result.current.loading).toBe(false);
  });

  it("should handle undefined orderItems", async () => {
    const { result } = renderHook(() => usePaymentForm(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("At least one orderItem is required");
  });

  it("should return deliveryInfo and paymentInfo", async () => {
    const { result } = renderHook(() =>
      usePaymentForm([
        {
          id: "1",
          quantity: 1,
        },
      ])
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.paymentInfo).toEqual({
      number: "",
      cvc: "",
      exp_month: "",
      exp_year: "",
      card_holder: "",
      customer_email: "",
      id_type: "",
      id_number: "",
      installments: 1,
    });
    expect(result.current.deliveryInfo).toEqual({
      address: "",
      country: "",
      city: "",
    });
    expect(result.current.orderItems).toEqual([
      {
        id: "1",
        quantity: 1,
      },
    ]);
    expect(result.current.error).toBeNull();
  });
});
