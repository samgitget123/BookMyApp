import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // Check authentication
  console.log(token, 'authtoken')
  return token ? <Outlet /> : <Navigate to="/LoginForm" />;
};

export default PrivateRoute;
