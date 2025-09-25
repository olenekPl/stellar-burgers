import {
  forgotPasswordApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';

export const getOrdersThunk = createAsyncThunk(
  'auth/getOrdersThunk',
  async () => getOrdersApi()
);

export const getUserThunk = createAsyncThunk('auth/getUserThunk', async () =>
  getUserApi()
);

export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: TLoginData) =>
    await loginUserApi({ email, password })
);

export const registerUserThunk = createAsyncThunk(
  'auth/registerUserThunk',
  async (data: TRegisterData) => registerUserApi(data)
);

export const logoutThunk = createAsyncThunk('auth/logoutThunk', async () =>
  logoutApi()
);

//редактирование профиля
export const updateUserThunk = createAsyncThunk(
  'auth/updateUserThunk',
  async (user: TRegisterData) => updateUserApi(user)
);

type TAuth = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser;
  loginUserError: string | undefined;
  loginUserRequest: boolean;
  myOrders: TOrder[];
  myOrderModalData: TOrder | undefined;
};

const initialState: TAuth = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: {
    email: '',
    name: ''
  },
  loginUserError: '',
  loginUserRequest: false,
  myOrders: [],
  myOrderModalData: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMyOrderModal: (state, action) => {
      state.myOrderModalData = state.myOrders.find(
        (order) => order._id === action.payload
      );
    },
    clearMyOrderModal: (state) => {
      state.myOrderModalData = undefined;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        setCookie('accessToken', action.payload.accessToken);
      });

    builder
      .addCase(getUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      });

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loginUserRequest = true;
        state.loginUserError = action.error.message;
        state.isAuthChecked = false;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.data = {
          email: '',
          name: ''
        };
        state.loginUserRequest = true;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.loginUserError = '';
        state.myOrders = []; //очищаем заказы при выходе
        state.myOrderModalData = undefined;
        localStorage.setItem('refreshToken', '');
        setCookie('accessToken', '');
      });

    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.loginUserRequest = false;
      });

    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.loginUserRequest = true;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.myOrders = action.payload;
      });
  }
});

export const authReducer = authSlice.reducer;
export const { setMyOrderModal, clearMyOrderModal } = authSlice.actions;
