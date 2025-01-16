import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { PaymentInfo, DeliveryInfo } from "../../types";
import {
  setLoading,
  setError,
  setPaymentInfo,
  setDeliveryInfo,
} from "../../reducers/paymentFormSlice";

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
      setError("At least one orderItem is required");
      dispatch(setLoading(false));
      return;
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
