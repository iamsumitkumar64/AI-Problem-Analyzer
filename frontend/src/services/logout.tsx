import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import backend_url from '../Libs/env';

const LogOut = () => {
  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post(`${backend_url}/logout`, {}, { withCredentials: true });
      } catch (err) {
        console.error('Logout failed:', err);
      }
    };
    logout();
  }, []);
  return <Navigate to="/login" replace />;
};

export default LogOut;