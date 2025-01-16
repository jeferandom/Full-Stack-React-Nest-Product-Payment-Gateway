import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  PaymentInfo,
  DeliveryInfo,
  OrderItem,
} from "../../components/payment/PaymentForm";

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

export const usePaymentForm = (orderItems?: OrderItem[]): UsePaymentResult => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
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
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    address: "",
    country: "",
    city: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderItems || orderItems.length < 1) {
      setError("At least one orderItem is required");
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [orderItems]);

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
