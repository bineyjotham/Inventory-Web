// src/components/dashboard/RecentActivity.tsx
import React from 'react';
import { 
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  AdjustmentsHorizontalIcon,
  UserCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'inbound',
      item: 'Laptop Pro 15"',
      user: 'Sarah Miller',
      time: '10:30 AM',
      quantity: 50,
      status: 'completed'
    },
    {
      id: 2,
      type: 'outbound',
      item: 'Wireless Mouse',
      user: 'Mike Wilson',
      time: '14:20 PM',
      quantity: 25,
      status: 'completed'
    },
    {
      id: 3,
      type: 'adjustment',
      item: 'Monitor 27" 4K',
      user: 'Alex Johnson',
      time: '16:45 PM',
      quantity: -2,
      status: 'pending'
    },
    {
      id: 4,
      type: 'inbound',
      item: 'Desk Chair',
      user: 'Sarah Miller',
      time: '11:15 AM',
      quantity: 30,
      status: 'completed'
    },
    {
      id: 5,
      type: 'outbound',
      item: 'USB-C Cables',
      user: 'Mike Wilson',
      time: '09:30 AM',
      quantity: 100,
      status: 'completed'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inbound': return <ArrowDownCircleIcon className="w-5 h-5 text-green-600" />;
      case 'outbound': return <ArrowUpCircleIcon className="w-5 h-5 text-red-600" />;
      case 'adjustment': return <AdjustmentsHorizontalIcon className="w-5 h-5 text-blue-600" />;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'pending': return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            {getTypeIcon(activity.type)}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 truncate">
                {activity.item}
              </h4>
              <span className={`text-sm font-medium ${
                activity.type === 'inbound' ? 'text-green-600' :
                activity.type === 'outbound' ? 'text-red-600' :
                'text-blue-600'
              }`}>
                {activity.type === 'inbound' ? '+' : ''}{activity.quantity}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <UserCircleIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 truncate">{activity.user}</span>
              <span className="text-gray-400">•</span>
              <ClockIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{activity.time}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex-shrink-0">
            {getStatusIcon(activity.status)}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="text-center py-8">
          <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;