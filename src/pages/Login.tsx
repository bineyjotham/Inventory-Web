// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BuildingStorefrontIcon, ShieldCheckIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleDemoLogin = (role: 'admin' | 'manager' | 'staff') => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const demoCredentials = {
        admin: { email: 'admin@inventory.com', password: 'admin123' },
        manager: { email: 'manager@inventory.com', password: 'manager123' },
        staff: { email: 'staff@inventory.com', password: 'staff123' }
      };

      const success = login(
        demoCredentials[role].email,
        demoCredentials[role].password,
        role
      );

      if (success) {
        toast.success(`Logged in as ${role}`);
        navigate(from, { replace: true });
      } else {
        toast.error('Login failed');
      }
      setLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // For demo purposes - in real app, validate with backend
    setTimeout(() => {
      let role: 'admin' | 'manager' | 'staff' = 'staff';
      
      if (email.includes('admin')) role = 'admin';
      else if (email.includes('manager')) role = 'manager';
      
      const success = login(email, password, role);
      
      if (success) {
        toast.success('Login successful');
        navigate(from, { replace: true });
      } else {
        toast.error('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and Info */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <BuildingStorefrontIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">StockMaster Pro</h1>
                <p className="text-gray-600">Inventory Management System</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Role-Based Access</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Administrator</h3>
                      <p className="text-sm text-gray-600">Full system access, user management, settings</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                    <ChartBarIcon className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Manager</h3>
                      <p className="text-sm text-gray-600">Reports, supplier management, monitoring</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                    <UserGroupIcon className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Warehouse Staff</h3>
                      <p className="text-sm text-gray-600">View inventory, track movements, submit requests</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="font-semibold text-lg mb-2">Modern Inventory Management</h3>
                <p className="text-blue-100">
                  Centralize inventory information, track movements in real-time, and generate insightful reports.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                <BuildingStorefrontIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-600 mt-2">Sign in to your inventory dashboard</p>
            </div>

            {!showRoleSelector ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRoleSelector(true)}
                  className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Try Demo Accounts
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Choose Demo Role</h2>
                  <p className="text-gray-600 mt-1">Experience different permission levels</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => handleDemoLogin('admin')}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <ShieldCheckIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Administrator</div>
                        <div className="text-sm text-gray-600">Full system access</div>
                      </div>
                    </div>
                    <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDemoLogin('manager')}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <ChartBarIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Manager</div>
                        <div className="text-sm text-gray-600">Reports & monitoring</div>
                      </div>
                    </div>
                    <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={() => handleDemoLogin('staff')}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <UserGroupIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Warehouse Staff</div>
                        <div className="text-sm text-gray-600">View & track inventory</div>
                      </div>
                    </div>
                    <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRoleSelector(false)}
                  className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2"
                >
                  ← Back to regular login
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                By signing in, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Mobile-only branding */}
          <div className="lg:hidden mt-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BuildingStorefrontIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">StockMaster Pro</h1>
            </div>
            <p className="text-gray-600">Modern Inventory Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;