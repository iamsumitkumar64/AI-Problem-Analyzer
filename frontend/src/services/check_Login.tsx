import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import backend_url from '../Libs/env';
import { message } from 'antd';

interface CheckLoginProps {
  children: React.ReactNode;
}

const CheckLogin = ({ children }: CheckLoginProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isload, setIsLoad] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const check_Login = async () => {
      try {
        const response = await axios.post(
          `${backend_url}/checkLogin`,
          {},
          { withCredentials: true }
        );
        if (response.status == 200) {
          messageApi.success(response.data.message);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('LogIn failed:', err);
        setIsLoggedIn(false);
      } finally {
        setIsLoad(false);
      }
    };
    check_Login();
  }, []);
  if (isload) {
    return <></>
  }
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return (<>
    {contextHolder}
    {children}
  </>);
};

export default CheckLogin;