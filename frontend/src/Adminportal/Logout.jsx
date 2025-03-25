import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    localStorage.clear();

    // Remove user_id and token from localStorage
//     localStorage.removeItem('user_id');
//     localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
//     console.log(localStorage.getItem('role')); // Should be null
// console.log(localStorage.getItem('name')); // Should be null
//     // Redirect to login page after logout
    navigate('/');
  };
  

export default Logout;
