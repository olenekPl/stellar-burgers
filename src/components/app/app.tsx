import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Preloader } from '../ui/preloader';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { ReactNode, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredientsThunk } from '../../services/ingredientsSlice';
import { getFeedsThunk } from '../../services/ordersSlice';
import { getOrdersThunk, getUserThunk } from '../../services/authSlice';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (
    (location.pathname === '/login' || location.pathname === '/register') &&
    isAuthenticated
  ) {
    return <Navigate to='/profile' />;
  } else if (
    (location.pathname === '/login' ||
      location.pathname === '/register' ||
      location.pathname === '/forgot-password' ||
      location.pathname === '/reset-password') &&
    !isAuthenticated
  )
    return <>{children}</>;

  const isProfileRoute =
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/profile/orders');

  if (isProfileRoute) {
    return isAuthenticated ? <>{children}</> : <Navigate to='/login' />;
  }

  return <>{children}</>;
};

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

  const background = useMemo(() => {
    if (location.state?.background) {
      return location.state.background;
    }

    const pathname = location.pathname;
    if (pathname.includes('/feed/')) {
      return { pathname: '/feed' };
    } else if (pathname.includes('/profile/orders/')) {
      return { pathname: '/profile/orders' };
    } else if (pathname.includes('/ingredients/')) {
      return { pathname: '/' };
    }

    return null;
  }, [location]);

  useEffect(() => {
    dispatch(getIngredientsThunk());
    dispatch(getFeedsThunk());
    dispatch(getUserThunk());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getOrdersThunk());
    }
  }, [isAuthenticated]);

  const handleModalClose = () => {
    navigate(-1);
  };

  if (!isAuthChecked && location.pathname.startsWith('/profile')) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Защищённые маршруты */}
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Страница деталей заказа (для прямого перехода) */}
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* Страница деталей ингредиента (для прямого перехода) */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Страница 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Заказ'} onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Ингредиент'} onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title={'Мой заказ'} onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
