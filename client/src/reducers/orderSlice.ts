import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OrderItem } from "../types/";

interface OrderState {
  loading: boolean;
  orderItems: OrderItem[];
  error: string | null;
}

const initialState: OrderState = {
  loading: true,
  orderItems: [],
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderItems(state, action: PayloadAction<OrderItem[]>) {
      state.orderItems = action.payload;
      state.error = null;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setOrderItems, setError, setLoading } = orderSlice.actions;

export default orderSlice.reducer;
