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
  import { TUser } from '@utils-types';
  import { setCookie } from '../utils/cookie';
  
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
  };
  
  const initialState: TAuth = {
    isAuthChecked: false, //флаг для статуса проверки токена 
    isAuthenticated: false,
    data: {
      email: '',
      name: ''
    },
    loginUserError: '',
    loginUserRequest: false
  };
  
  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
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
          localStorage.setItem('refreshToken', '');
          setCookie('accessToken', '');
        });
      // add
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
    }
  });
  
  export const authReducer = authSlice.reducer;
  export const {} = authSlice.actions;