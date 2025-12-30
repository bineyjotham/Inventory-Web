import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  TruckIcon,
  Cog6ToothIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import QuickActions from '../dashboard/QuickActions';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['admin', 'manager', 'staff'] },
    { name: 'Inventory', href: '/inventory', icon: CubeIcon, roles: ['admin', 'manager', 'staff'] },
    { name: 'Movements', href: '/movements', icon: ArrowsRightLeftIcon, roles: ['admin', 'manager', 'staff'] },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon, roles: ['admin', 'manager'] },
    { name: 'Suppliers', href: '/suppliers', icon: TruckIcon, roles: ['admin', 'manager'] },
    { name: 'User Management', href: '/users', icon: UserGroupIcon, roles: ['admin'] },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, roles: ['admin'] },
  ];

  const filteredNav = navigation.filter(item => 
    item.roles.includes(user?.role || 'staff')
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
      <nav className="p-4 space-y-1 flex-1">
        {filteredNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 mt-8 border-t border-gray-200">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          <QuickActions 
          userRole={user?.role || 'staff'}
          maxItems={4}
          compact={true}
          showHeader={false}
        />
        </div>
        <div className="space-y-2">
          {user?.role === 'admin' && (
            <button className="w-full flex items-center px-4 py-2 text-sm text-green-700 bg-green-50 rounded-lg hover:bg-green-100">
              <CubeIcon className="w-4 h-4 mr-2" />
              Add New Item
            </button>
          )}
          <button className="w-full flex items-center px-4 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100">
            <ArrowsRightLeftIcon className="w-4 h-4 mr-2" />
            Record Movement
          </button>
          {user?.role !== 'staff' && (
            <button className="w-full flex items-center px-4 py-2 text-sm text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100">
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Generate Report
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;