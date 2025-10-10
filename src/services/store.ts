import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice';
import feeReducer from './feedSlice';
import orderReducer from './ordersSlice';
import userReducer from './userSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  feedsReducer: feeReducer,
  ingredientsReducer: ingredientsReducer,
  constructorReducer: constructorReducer,
  orderReducer: orderReducer,
  userReducer: userReducer
}); // Заменить на импорт настоящего редьюсера

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
