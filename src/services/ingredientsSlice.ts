import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  async () => getIngredientsApi()
);

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  ingredientData: TIngredient | undefined;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  ingredientData: undefined
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredientToModal: (state, action: PayloadAction<string>) => {
      state.ingredientData = state.ingredients.find(
        (el) => el._id === action.payload
      );
    },
    clearIngredientModal: (state) => {
      state.ingredientData = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredientsThunk.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
export const { setIngredientToModal, clearIngredientModal } =
  ingredientsSlice.actions;
