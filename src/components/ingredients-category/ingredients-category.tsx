import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { setIngredientToModal } from '../../services/ingredientsSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  /** TODO: взять переменную из стора */
  let bunsId: string[] = [];
  if (title === 'Булки') {
    bunsId = ingredients.map((el) => el._id);
  }
  const burgerConstructor = {
    bun: {
      _id: bunsId
    },
    ingredients: ingredients
  };

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;

    const counters: { [key: string]: number } = {};

    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    bun._id.forEach((id) => (counters[id] = 2));

    return counters;
  }, [burgerConstructor]);

  // Обработчик клика по ингредиенту
  const handleIngredientClick = (ingredient: TIngredient) => {
    dispatch(setIngredientToModal(ingredient._id));
    navigate(`/ingredients/${ingredient._id}`, {
      state: { background: location }
    });
  };

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      onIngredientClick={handleIngredientClick}
    />
  );
});
