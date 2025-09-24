import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { orderBurgerThunk, resetOrderData } from '../../services/burgerSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(
    (state) => state.burgers.constructorItems
  );

  const orderRequest = useSelector((state) => state.burgers.loading);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const orderModalData = useSelector((state) => state.burgers.myOrderModalData);

  const onOrderClick = () => {
    if ((!constructorItems.bun || orderRequest) && isAuth) return;
    dispatch(
      orderBurgerThunk([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((ing) => ing._id)
      ])
    );
  };
  const closeOrderModal = () => dispatch(resetOrderData());

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData._id ? orderModalData : null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};