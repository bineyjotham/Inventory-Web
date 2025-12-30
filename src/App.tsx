import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Movements from './pages/Movements';
import Reports from './pages/Reports';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';
import Login from './pages/Login';
import RoleGuard from './components/auth/RoleGuard';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <RoleGuard>
              <Layout />
            </RoleGuard>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="movements" element={<Movements />} />
            <Route path="reports" element={
              <RoleGuard allowedRoles={['admin', 'manager']}>
                <Reports />
              </RoleGuard>
            } />
            <Route path="suppliers" element={
              <RoleGuard allowedRoles={['admin', 'manager']}>
                <Suppliers />
              </RoleGuard>
            } />
            <Route path="settings" element={
              <RoleGuard allowedRoles={['admin']}>
                <Settings />
              </RoleGuard>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;