import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import StatsCards from '../components/dashboard/StatsCards';
import InventoryChart from '../components/dashboard/InventoryChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  BellIcon,
  ArrowPathIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'purple';
  description: string;
  onClick?: () => void;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [stats, setStats] = useState<any[]>([]);

  // Load initial stats
  useEffect(() => {
    loadDashboardStats();
  }, [timeRange]);

  const loadDashboardStats = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data based on user role
      const baseStats: StatCard[] = [
        {
          title: 'Total Items',
          value: '1,248',
          change: '+12.5%',
          trend: 'up' as const,
          icon: CubeIcon,
          color: 'blue' as const,
          description: 'Total number of items in inventory',
        },
        {
          title: 'Low Stock Items',
          value: '24',
          change: '-3.2%',
          trend: 'down' as const,
          icon: ExclamationTriangleIcon,
          color: 'orange' as const,
          description: 'Items below minimum stock level',
        },
        {
          title: 'Total Value',
          value: '$248,950',
          change: '+8.7%',
          trend: 'up' as const,
          icon: CurrencyDollarIcon,
          color: 'green' as const,
          description: 'Total inventory valuation',
        },
        {
          title: 'Movements Today',
          value: '47',
          change: '+15.3%',
          trend: 'up' as const,
          icon: ArrowsRightLeftIcon,
          color: 'purple' as const,
          description: 'Inventory movements recorded today',
        },
      ];

      // Add role-specific stats
      if (user?.role === 'admin') {
        baseStats.push({
          title: 'Pending Approvals',
          value: '5',
          change: '+2',
          trend: 'up' as const,
          icon: BellIcon,
          color: 'green' as const,
          description: 'Items awaiting approval',
          onClick: () => toast.success('Navigating to approvals...'),
        });
      }

      if (user?.role === 'manager' || user?.role === 'admin') {
        baseStats.push({
          title: 'Active Orders',
          value: '18',
          change: '+4',
          trend: 'up' as const,
          icon: ShoppingCartIcon,
          color: 'blue' as const,
          description: 'Active purchase orders',
          onClick: () => {toast.success('Viewing active orders...');
          },
        });
      }

      setStats(baseStats);
      setIsRefreshing(false);
    }, 500);
  };

  const handleRefresh = () => {
    loadDashboardStats();
    toast.success('Dashboard refreshed!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}. Here's what's happening with your inventory.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg">
            {['day', 'week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1.5 text-sm font-medium capitalize ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                } ${range === 'day' ? 'rounded-l-lg' : range === 'month' ? 'rounded-r-lg' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards 
        stats={stats} 
        interactive={true}
        showCharts={true}
      />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Overview</h2>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <InventoryChart />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </button>
          </div>
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions userRole={user?.role || 'staff'} />
        </div>
        
        {/* Performance Metrics */}
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-700 font-medium">Turnover Rate</div>
                    <div className="text-2xl font-bold text-blue-900 mt-1">4.2x</div>
                  </div>
                  <ArrowTrendingUpIcon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center text-sm text-blue-600 mt-2">
                  <span className="bg-blue-100 px-2 py-1 rounded text-xs">+12% improvement</span>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-700 font-medium">Stock Accuracy</div>
                    <div className="text-2xl font-bold text-green-900 mt-1">98.7%</div>
                  </div>
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex items-center text-sm text-green-600 mt-2">
                  <span className="bg-green-100 px-2 py-1 rounded text-xs">+2.1% increase</span>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-purple-700 font-medium">Avg. Order Time</div>
                    <div className="text-2xl font-bold text-purple-900 mt-1">2.3 days</div>
                  </div>
                  <ArrowTrendingDownIcon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex items-center text-sm text-purple-600 mt-2">
                  <span className="bg-purple-100 px-2 py-1 rounded text-xs">15% faster</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alerts Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
          <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            3 New
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-red-900">Critical: Laptop Pro 15" out of stock</div>
              <div className="text-sm text-red-700">Reorder immediately to avoid disruptions</div>
            </div>
            <button className="text-sm font-medium text-red-700 hover:text-red-900">
              Reorder
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-orange-900">Warning: 5 items below minimum stock</div>
              <div className="text-sm text-orange-700">Consider restocking these items soon</div>
            </div>
            <button className="text-sm font-medium text-orange-700 hover:text-orange-900">
              View List
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-blue-900">Information: Monthly backup completed</div>
              <div className="text-sm text-blue-700">System backup completed successfully</div>
            </div>
            <button className="text-sm font-medium text-blue-700 hover:text-blue-900">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
