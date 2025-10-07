import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { orderBurgerThunk } from '../../services/ordersSlice';
import { resetConstructor } from '../../services/constructorSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const constructorItems = useSelector(
    (state) => state.burgerConstructor.constructorItems
  );

  const orderRequest = useSelector((state) => state.orders.orderRequest);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const orderModalData = useSelector((state) => state.auth.myOrderModalData);

  const onOrderClick = () => {
    if ((!constructorItems?.bun || orderRequest) && isAuth) return;
    if (!isAuth) {
      navigate('/login');
      return;
    }
    dispatch(
      orderBurgerThunk([
        constructorItems!.bun!._id,
        ...constructorItems!.ingredients.map((ing) => ing._id)
      ])
    );
  };

  const closeOrderModal = () => dispatch(resetConstructor());

  const price = useMemo(
    () =>
      (constructorItems?.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems?.ingredients?.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ) || 0),
    [constructorItems]
  );

  if (!constructorItems) {
    return null;
  }

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData?._id ? orderModalData : null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
