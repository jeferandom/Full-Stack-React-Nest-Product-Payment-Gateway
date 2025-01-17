import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentInfo, DeliveryInfo } from "../types/";

interface PaymentFormState {
  loading: boolean;
  paymentInfo: PaymentInfo;
  deliveryInfo: DeliveryInfo;
  error: string | null;
}

interface Inputs {
  number: string;
  card_holder: string;
  installments: number;
  address: string;
  city: string;
  country: string;
}

const initialState: PaymentFormState = {
  loading: true,
  paymentInfo: {
    number: "",
    cvc: "",
    exp_month: "",
    exp_year: "",
    card_holder: "",
    customer_email: "",
    id_type: "",
    id_number: "",
    installments: 1,
  },
  deliveryInfo: {
    address: "",
    country: "",
    city: "",
  },
  error: null,
};

const paymentFormSlice = createSlice({
  name: "paymentForm",
  initialState,
  reducers: {
    setPaymentInfo(state, action: PayloadAction<Partial<PaymentInfo>>) {
      state.paymentInfo = { ...state.paymentInfo, ...action.payload };
    },
    setDeliveryInfo(state, action: PayloadAction<DeliveryInfo>) {
      state.deliveryInfo = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    onSubmit(state, action: PayloadAction<Inputs>) {
      console.log(action.payload);
    },
  },
});

export const {
  setPaymentInfo,
  setDeliveryInfo,
  setError,
  setLoading,
  onSubmit,
} = paymentFormSlice.actions;

export default paymentFormSlice.reducer;
