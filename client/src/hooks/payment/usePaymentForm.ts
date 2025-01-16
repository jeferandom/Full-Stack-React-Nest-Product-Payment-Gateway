import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { PaymentInfo, DeliveryInfo } from "../../types";
import { setLoading, setError } from "../../reducers/paymentFormSlice";
import { setOrderItems } from "../../reducers/orderSlice";

interface UsePaymentResult {
  loading: boolean;
  paymentInfo: PaymentInfo;
  deliveryInfo: DeliveryInfo;
  error: string | null;
}

export type Inputs = {
  number: string;
  card_holder: string;
  installments: number;
  address: string;
  city: string;
  country: string;
};

export const usePaymentForm = (): UsePaymentResult => {
  const dispatch = useDispatch();
  const { paymentInfo, deliveryInfo, error, loading } = useSelector(
    (state: RootState) => state.paymentForm
  );
  const { orderItems } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (!orderItems || orderItems.length < 1) {
      const savedOrderItems = localStorage.getItem("orderItems");
      if (savedOrderItems) {
        dispatch(setOrderItems(JSON.parse(savedOrderItems)));
      } else {
        setError("At least one orderItem is required");
        dispatch(setLoading(false));
        return;
      }
    }
    dispatch(setLoading(false));
  }, [orderItems, dispatch]);

  return {
    loading,
    paymentInfo,
    deliveryInfo,
    error,
  };
};
