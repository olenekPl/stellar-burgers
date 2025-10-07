import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUserThunk } from '../../services/authSlice';
import { useDispatch } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [data, setData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setData({ email: email, password: password });
  };

  useEffect(() => {
    if (!data.email || !data.password) {
      return;
    }
    dispatch(loginUserThunk(data));
  }, [data]);

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
