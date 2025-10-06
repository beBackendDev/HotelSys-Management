//Redux logic
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import paymentApi from "../api/payment.api";

export const processPayment = createAsyncThunk(
  "payment/process-payment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const res = await paymentApi.pay(paymentData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {},
});

export default paymentSlice.reducer;
