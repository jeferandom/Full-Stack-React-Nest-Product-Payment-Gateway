import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { PaymentInfo, DeliveryInfo, OrderItem } from "../../types";
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
  handleSubmit: ReturnType<typeof useForm>["handleSubmit"];
  errors: ReturnType<typeof useForm>["formState"]["errors"];
  onSubmit: SubmitHandler<Inputs>;
  orderItems?: OrderItem[];
}

type Inputs = {
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

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (!orderItems || orderItems.length < 1) {
      setError("At least one orderItem is required");
      dispatch(setLoading(false));
      return;
    }
    dispatch(setLoading(false));
  }, [orderItems, dispatch]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return {
    loading,
    paymentInfo,
    deliveryInfo,
    orderItems,
    error,
    handleSubmit,
    errors,
    onSubmit,
  };
};
