import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredientToConstructor: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
          return;
        }
        state.constructorItems.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        } as TConstructorIngredient
      })
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const [ingredient] = state.constructorItems.ingredients.splice(
          index,
          1
        );
        state.constructorItems.ingredients.splice(index - 1, 0, ingredient);
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.constructorItems.ingredients.length - 1) {
        const [ingredient] = state.constructorItems.ingredients.splice(
          index,
          1
        );
        state.constructorItems.ingredients.splice(index + 1, 0, ingredient);
      }
    },
    deleteIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    resetConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    }
  }
});

export const constructorReducer = constructorSlice.reducer;
export const {
  addIngredientToConstructor,
  moveIngredientUp,
  moveIngredientDown,
  deleteIngredient,
  resetConstructor
} = constructorSlice.actions;
