import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    // Remove user_id and token from localStorage
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
  
    // Redirect to login page after logout
    navigate('/login');
  };
  

export default Logout;
