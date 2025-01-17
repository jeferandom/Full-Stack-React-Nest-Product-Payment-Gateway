import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { PaymentInfo, DeliveryInfo } from "../../types";
import { setOrderItems } from "../../reducers/orderSlice";
import {
  setPaymentInfo,
  setDeliveryInfo,
} from "../../reducers/paymentFormSlice";
import { getProduct, Product } from "../../services/productService";
import { createOrder } from "../../services/orderService";

interface UseOrderSummaryResult {
  loading: boolean;
  error: string | null;
  orderItems: OrderItemPopulated[];
  paymentInfo: PaymentInfo;
  deliveryInfo: DeliveryInfo;
  createOrder: () => Promise<void>;
}

export interface OrderItemPopulated extends Product {
  quantity: number;
}

export const useOrderSummary = (): UseOrderSummaryResult => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { orderItems } = useSelector((state: RootState) => state.order);
  const [populatedOrderItems, setPopulatedOrderItems] = useState<
    OrderItemPopulated[]
  >([]);
  const { paymentInfo, deliveryInfo } = useSelector(
    (state: RootState) => state.paymentForm
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const savedOrderItems = localStorage.getItem("orderItems");
        if (orderItems.length < 1 && savedOrderItems) {
          if (savedOrderItems) {
            dispatch(setOrderItems(JSON.parse(savedOrderItems)));
          }
        }
        const populatedItems = await Promise.all(
          orderItems.map(async (item) => {
            const result = await getProduct(item.id);
            if (result.success) {
              return {
                ...result.data,
                quantity: item.quantity,
              };
            }
            throw new Error(`Failed to fetch product ${item.id}`);
          })
        );

        setPopulatedOrderItems(populatedItems);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load order items"
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, [orderItems, dispatch]);

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const orderData = {
        items: orderItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        customerId: "123",
        status: "PENDING" as const,
        customer_email: paymentInfo.customer_email,
        deliveryInfo,
        cardToken: "tok_test",
        cardInfo: {
          number: paymentInfo.number,
          cvc: paymentInfo.cvc,
          exp_month: paymentInfo.exp_month,
          exp_year: paymentInfo.exp_year,
          card_holder: paymentInfo.card_holder,
        },
      };

      const result = await createOrder(orderData);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
      setLoading(false);
    }
  };

  return {
    loading,
    orderItems: populatedOrderItems,
    paymentInfo,
    deliveryInfo,
    error,
    createOrder: handleCreateOrder,
  };
};
