import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  deleteIngridientInOrder,
  moveDownIngridient,
  moveUpIngridient
} from '../../services/burgerSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const handleMoveDown = () => {
      dispatch(moveDownIngridient({ index: index, ingredient: ingredient }));
    };

    const handleMoveUp = () => {
      dispatch(moveUpIngridient({ index: index, ingredient: ingredient }));
    };

    const handleClose = () => {
      dispatch(deleteIngridientInOrder(index));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);