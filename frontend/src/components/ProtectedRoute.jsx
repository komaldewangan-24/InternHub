import React from 'react';
import { Navigate } from 'react-router-dom';
import { getDefaultRouteForRole, getStoredUser, getToken } from '../services/session';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate replace to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate replace to={getDefaultRouteForRole(user.role)} />;
  }

  return children;
}
