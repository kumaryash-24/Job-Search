import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (user && user.role === 'admin') {
    return <Outlet />; // Renders the child route (AdminDashboard)
  } else {
    // If not an admin, redirect them to the login page.
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;