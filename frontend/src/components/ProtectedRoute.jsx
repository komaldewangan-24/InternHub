import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component to restrict access based on authentication and roles.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized.
 * @param {Array<string>} [props.allowedRoles] - Optional list of roles that are allowed to access the route.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // If no token or no user, redirect to login
  if (!token || !user) {
    return <Navigate to="/login_page" replace />;
  }

  // If roles are specified, check if the user has one of the allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a safe dashboard based on their actual role
    if (user.role === 'student') return <Navigate to="/student_dashboard" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty_dashboard" replace />;
    if (user.role === 'recruiter') return <Navigate to="/recruiter_dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin_dashboard" replace />;
    
    // Default fallback
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
