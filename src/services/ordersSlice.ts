import { getFeedsApi, getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getFeedsThunk = createAsyncThunk('orders/getFeeds', async () =>
  getFeedsApi()
);

export const orderBurgerThunk = createAsyncThunk(
  'orders/orderBurger',
  async (data: string[]) => orderBurgerApi(data)
);

export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

type TOrdersState = {
  feed: any;
  orders: TOrder[];
  loading: boolean;
  orderRequest: boolean;
  orderData: TOrder | undefined;
};

const initialState: TOrdersState = {
  feed: {},
  orders: [],
  loading: false,
  orderRequest: false,
  orderData: undefined
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderToModal: (state, action: PayloadAction<number>) => {
      state.orderData = state.orders.find(
        (order) => order.number === action.payload
      );
    },
    clearOrderModal: (state) => {
      state.orderData = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
        state.orders = action.payload.orders;
      })
      .addCase(getFeedsThunk.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(orderBurgerThunk.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
      })
      .addCase(orderBurgerThunk.rejected, (state) => {
        state.loading = false;
        state.orderRequest = false;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
      });

    builder
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload.orders[0];
      })
      .addCase(getOrderByNumberThunk.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const ordersReducer = ordersSlice.reducer;
export const { setOrderToModal, clearOrderModal } = ordersSlice.actions;
