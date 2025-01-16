import { combineReducers } from "@reduxjs/toolkit";
import paymentFormReducer from "./paymentFormSlice";
import orderSlice from "./orderSlice";

const rootReducer = combineReducers({
  paymentForm: paymentFormReducer,
  order: orderSlice,
});

export default rootReducer;
