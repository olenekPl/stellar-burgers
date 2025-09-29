import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { setIngredientToModal } from '../../services/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Получаем ID из URL

  const ingredientData = useSelector(
    (state) => state.ingredients.ingredientData
  );

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  // Загружаем данные ингредиента при монтировании или изменении ID
  useEffect(() => {
    if (id && ingredients.length) {
      dispatch(setIngredientToModal(id));
    }
  }, [dispatch, id, ingredients]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
