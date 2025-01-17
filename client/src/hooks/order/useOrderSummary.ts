import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { OrderSummary } from "../../types";
import { setLoading, setError } from "../../reducers/orderSummarySlice";
import { setOrderItems } from "../../reducers/orderSlice";

interface UseOrderSummaryResult {
  loading: boolean;
  orderSummary: OrderSummary;
  error: string | null;
}

export const useOrderSummary = (): UseOrderSummaryResult => {
  const dispatch = useDispatch();
  const { orderSummary, error, loading } = useSelector(
    (state: RootState) => state.orderSummary
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
    orderSummary,
    error,
  };
};
