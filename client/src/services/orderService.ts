import { Result, ApiError } from "../utils/errors";
import { DeliveryInfo } from "../types";

interface OrderItem {
  id: string;
  quantity: number;
}

interface CardInfo {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
}

interface CreateOrderRequest {
  items: OrderItem[];
  customerId: string;
  status: "CREATED" | "PENDING" | "COMPLETED" | "FAILED";
  customer_email: string;
  deliveryInfo: DeliveryInfo;
  cardToken: string;
  cardInfo: CardInfo;
}

interface Transaction {
  id: string;
  created_at: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  status: string;
  status_message: string | null;
  redirect_url: string | null;
}

interface CreateOrderResponse {
  id: string;
  items: OrderItem[];
  customerId: string;
  status: string;
  customer_email: string;
  deliveryInfo: DeliveryInfo;
  createdAt: string;
  cardToken: string;
  lastFourDigits: string;
  total: number;
  transaction: Transaction;
}

const API_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (
  orderData: CreateOrderRequest
): Promise<Result<CreateOrderResponse>> => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      return {
        success: false,
        error: new ApiError(
          response.status,
          (await response.text()) || "Failed to create order",
          "API_ERROR"
        ),
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: new ApiError(
        500,
        err instanceof Error ? err.message : "Internal error",
        "UNKNOWN_ERROR"
      ),
    };
  }
};
