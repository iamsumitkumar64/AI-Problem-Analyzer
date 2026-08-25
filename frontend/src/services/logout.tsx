import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backend_url from '../Libs/env';

const LogOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.post(`${backend_url}/logout`, {}, { withCredentials: true });
      } catch (err) {
        try {
          await axios.get(`${backend_url}/logout`, { withCredentials: true });
        } catch (e) {
          console.error('Logout error:', e);
        }
      } finally {
        navigate('/login', { replace: true });
      }
    };
    performLogout();
  }, [navigate]);

  return <></>;
};

export default LogOut;