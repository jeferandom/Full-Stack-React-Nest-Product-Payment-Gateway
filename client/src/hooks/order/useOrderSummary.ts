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

interface UseOrderSummaryResult {
  loading: boolean;
  error: string | null;
  orderItems: OrderItemPopulated[];
  paymentInfo: PaymentInfo;
  deliveryInfo: DeliveryInfo;
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

        const savedFormState = localStorage.getItem("paymentFormState");

        if (savedFormState) {
          const parsedState = JSON.parse(savedFormState);

          dispatch(
            setPaymentInfo({
              number: parsedState.number,
              card_holder: parsedState.card_holder,
              exp_month: parsedState.exp_month,
              exp_year: parsedState.exp_year,
              id_type: parsedState.idType,
              id_number: parsedState.idNumber,
              installments: parsedState.installments,
              customer_email: "jefmancera@test.com",
            })
          );

          dispatch(
            setDeliveryInfo({
              address: parsedState.address,
              city: parsedState.city,
              country: parsedState.country,
            })
          );
        }

        setLoading(true);
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

  return {
    loading,
    orderItems: populatedOrderItems,
    paymentInfo,
    deliveryInfo,
    error,
  };
};
