import React, { useState } from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserGroupIcon,
  ClockIcon,
  InformationCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Tooltip } from '../common/Tooltip';

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo' | 'pink';
  description?: string;
  loading?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}

interface StatsCardsProps {
  stats?: StatCard[];
  compact?: boolean;
  interactive?: boolean;
  showCharts?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ 
  stats: propStats, 
  compact = false,
  interactive = true,
  showCharts = false
}) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Default stats if none provided
  const defaultStats: StatCard[] = [
    {
      title: 'Total Items',
      value: '1,248',
      change: '+12.5%',
      trend: 'up',
      icon: CubeIcon,
      color: 'blue',
      description: 'Total number of items in inventory',
    },
    {
      title: 'Low Stock Items',
      value: '24',
      change: '-3.2%',
      trend: 'down',
      icon: ExclamationTriangleIcon,
      color: 'orange',
      description: 'Items below minimum stock level',
    },
    {
      title: 'Total Value',
      value: '$248,950',
      change: '+8.7%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'green',
      description: 'Total inventory valuation',
    },
    {
      title: 'Movements Today',
      value: '47',
      change: '+15.3%',
      trend: 'up',
      icon: ArrowsRightLeftIcon,
      color: 'purple',
      description: 'Inventory movements recorded today',
    },
    {
      title: 'Pending Orders',
      value: '12',
      change: '+4.2%',
      trend: 'up',
      icon: ShoppingCartIcon,
      color: 'red',
      description: 'Purchase orders awaiting delivery',
    },
    {
      title: 'Active Suppliers',
      value: '8',
      change: '+1',
      trend: 'up',
      icon: TruckIcon,
      color: 'indigo',
      description: 'Active supplier partnerships',
    },
    {
      title: 'Active Users',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: UserGroupIcon,
      color: 'pink',
      description: 'Users currently active in the system',
    },
    {
      title: 'Avg. Processing',
      value: '2.3 hrs',
      change: '-15 min',
      trend: 'down',
      icon: ClockIcon,
      color: 'blue',
      description: 'Average order processing time',
    },
  ];

  const stats = propStats || defaultStats.slice(0, compact ? 4 : 8);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-100',
        icon: 'text-blue-600',
        text: 'text-blue-700',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-100'
      };
      case 'green': return {
        bg: 'bg-green-50',
        iconBg: 'bg-green-100',
        icon: 'text-green-600',
        text: 'text-green-700',
        border: 'border-green-200',
        hover: 'hover:bg-green-100'
      };
      case 'red': return {
        bg: 'bg-red-50',
        iconBg: 'bg-red-100',
        icon: 'text-red-600',
        text: 'text-red-700',
        border: 'border-red-200',
        hover: 'hover:bg-red-100'
      };
      case 'orange': return {
        bg: 'bg-orange-50',
        iconBg: 'bg-orange-100',
        icon: 'text-orange-600',
        text: 'text-orange-700',
        border: 'border-orange-200',
        hover: 'hover:bg-orange-100'
      };
      case 'purple': return {
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-100',
        icon: 'text-purple-600',
        text: 'text-purple-700',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-100'
      };
      case 'indigo': return {
        bg: 'bg-indigo-50',
        iconBg: 'bg-indigo-100',
        icon: 'text-indigo-600',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        hover: 'hover:bg-indigo-100'
      };
      case 'pink': return {
        bg: 'bg-pink-50',
        iconBg: 'bg-pink-100',
        icon: 'text-pink-600',
        text: 'text-pink-700',
        border: 'border-pink-200',
        hover: 'hover:bg-pink-100'
      };
      default: return {
        bg: 'bg-gray-50',
        iconBg: 'bg-gray-100',
        icon: 'text-gray-600',
        text: 'text-gray-700',
        border: 'border-gray-200',
        hover: 'hover:bg-gray-100'
      };
    }
  };

  const handleCardClick = (title: string) => {
    if (interactive && stats.find(s => s.title === title)?.onClick) {
      stats.find(s => s.title === title)?.onClick?.();
    } else if (interactive) {
      const newExpanded = new Set(expandedCards);
      if (newExpanded.has(title)) {
        newExpanded.delete(title);
      } else {
        newExpanded.add(title);
      }
      setExpandedCards(newExpanded);
    }
  };

  const renderTrendIndicator = (trend: string, change: string) => {
    const isPositive = trend === 'up';
    const isNegative = trend === 'down';
    
    return (
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
        {isPositive ? (
          <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
        ) : isNegative ? (
          <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
        ) : null}
        <span>{change}</span>
        {trend !== 'neutral' && (
          <span className="ml-1 text-xs opacity-75">vs last period</span>
        )}
      </div>
    );
  };

  const renderMiniChart = (trend: 'up' | 'down' | 'neutral') => {
    const dataPoints = trend === 'up' 
      ? [30, 45, 35, 55, 40, 65, 50]
      : trend === 'down'
      ? [65, 50, 60, 45, 55, 40, 35]
      : [45, 50, 40, 55, 45, 50, 45];
    
    const max = Math.max(...dataPoints);
    const min = Math.min(...dataPoints);
    const range = max - min;
    
    return (
      <div className="flex items-end h-8 mt-2 space-x-0.5">
        {dataPoints.map((point, index) => {
          const height = ((point - min) / range) * 100 || 50;
          const bgColor = trend === 'up' 
            ? 'bg-green-500' 
            : trend === 'down' 
            ? 'bg-red-500' 
            : 'bg-gray-400';
          
          return (
            <div
              key={index}
              className={`w-1.5 ${bgColor} rounded-t transition-all duration-300`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-4`}>
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const Icon = stat.icon;
        const isExpanded = expandedCards.has(stat.title);
        
        return (
          <div
            key={stat.title}
            className={`relative ${colors.bg} ${colors.border} border rounded-xl p-4 transition-all duration-200 ${
              interactive ? `cursor-pointer ${colors.hover}` : ''
            } ${isExpanded ? 'col-span-2 row-span-2' : ''}`}
            onClick={() => handleCardClick(stat.title)}
          >
            {/* Loading State */}
            {stat.loading ? (
              <div className="animate-pulse space-y-3">
                <div className="flex justify-between items-start">
                  <div className="h-6 bg-gray-300 rounded w-32"></div>
                  <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            ) : (
              <>
                {/* Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-medium ${colors.text}`}>
                        {stat.title}
                      </h3>
                      {stat.description && (
                        <Tooltip content={stat.description}>
                          <InformationCircleIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      )}
                    </div>
                    
                    {/* Main Value */}
                    <div className="mt-2">
                      <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`${colors.iconBg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                </div>

                {/* Trend and Change */}
                {stat.change && stat.trend && (
                  <div className="mt-3">
                    {renderTrendIndicator(stat.trend, stat.change)}
                  </div>
                )}

                {/* Mini Chart (Optional) */}
                {showCharts && stat.trend && (
                  <div className="mt-3 opacity-60">
                    {renderMiniChart(stat.trend)}
                  </div>
                )}

                {/* Expanded View */}
                {isExpanded && interactive && (
                  <div className="mt-4 pt-4 border-t border-gray-200 animate-slide-down">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Detailed Analysis</span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          Last 30 days
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500">Peak Value</div>
                          <div className="font-medium text-gray-900">$52,450</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs text-gray-500">Avg. Daily</div>
                          <div className="font-medium text-gray-900">$8,298</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <ChartBarIcon className="w-3 h-3 inline mr-1" />
                        Showing detailed metrics for {stat.title.toLowerCase()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Interactive Hint */}
                {interactive && !stat.onClick && (
                  <div className="mt-2 text-xs text-gray-400 flex items-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {isExpanded ? 'Click to collapse' : 'Click for details'}
                    </span>
                  </div>
                )}

                {/* Status Indicators */}
                {stat.title === 'Low Stock Items' && Number(stat.value) > 20 && (
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                )}
                
                {stat.title === 'Pending Orders' && Number(stat.value) > 10 && (
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;