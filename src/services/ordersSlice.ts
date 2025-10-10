import {
  createAsyncThunk,
  createSlice,
  SerializedError,
  PayloadAction
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../utils/burger-api';

type TOrdersState = {
  isOrderLoading: boolean;
  isOrdersLoading: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: null | SerializedError;
  data: TOrder[];
};

export const initialState: TOrdersState = {
  isOrderLoading: true,
  isOrdersLoading: true,
  orderRequest: false,
  orderModalData: null,
  error: null,
  data: []
};

export const getOrders = createAsyncThunk<TOrder[]>(
  'order/getOrders',
  async (): Promise<TOrder[]> => await getOrdersApi()
);

export const createOrder = createAsyncThunk<
  {
    order: TOrder;
    name: string;
  },
  string[]
>('order/createOrder', async (data, { rejectWithValue }) => {
  const response = await orderBurgerApi(data);
  if (!response?.success) {
    return rejectWithValue(response);
  }
  return { order: response.order, name: response.name };
});

export const getOrder = createAsyncThunk<TOrder, number>(
  'order/getOrder',
  async (data, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    return response.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderModalData(state) {
      state.orderModalData = null;
    },
    setOrderToModal(state, action: PayloadAction<number>) {
      // Создаем временный объект заказа с номером для модального окна
      state.orderModalData = {
        number: action.payload,
        _id: 'temp',
        ingredients: [],
        status: 'pending',
        name: 'Загрузка...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as TOrder;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrder.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderModalData = action.payload;
      })
      .addCase(getOrder.rejected, (state) => {
        state.isOrderLoading = false;
      })
      .addCase(getOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
      });
  }
});

export const { resetOrderModalData, setOrderToModal } = orderSlice.actions;
export default orderSlice.reducer;
