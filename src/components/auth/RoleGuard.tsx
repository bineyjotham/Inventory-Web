// src/components/auth/RoleGuard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;