import React, { useState } from 'react';
import { UserRole } from '../../types';
import QuickActions from './QuickActions';
import { 
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';

interface QuickActionsPanelProps {
  userRole: UserRole;
  defaultExpanded?: boolean;
  position?: 'left' | 'right' | 'bottom';
  floating?: boolean;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  userRole,
  defaultExpanded = false,
  position = 'right',
  floating = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isMinimized, setIsMinimized] = useState(false);

  const positionClasses = {
    left: 'left-0 top-1/2 transform -translate-y-1/2',
    right: 'right-0 top-1/2 transform -translate-y-1/2',
    bottom: 'bottom-0 left-1/2 transform -translate-x-1/2'
  };

  const panelClasses = floating
    ? `fixed ${positionClasses[position]} z-40 shadow-2xl`
    : '';

  if (isMinimized) {
    return (
      <div className={`${panelClasses} bg-white rounded-lg border border-gray-200 shadow-lg`}>
        <button
          onClick={() => setIsMinimized(false)}
          className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
          title="Expand Quick Actions"
        >
          <ArrowsPointingOutIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className={`${panelClasses} bg-white rounded-xl border border-gray-200 shadow-lg w-80 max-w-full`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {userRole}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Minimize"
          >
            <ArrowsPointingInIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
          
          {floating && (
            <button
              onClick={() => console.log('Close panel')}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Close"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Panel Content */}
      <div className={`${isExpanded ? 'max-h-96' : 'max-h-48'} overflow-y-auto transition-all duration-300`}>
        <QuickActions 
          userRole={userRole}
          compact={true}
          maxItems={isExpanded ? 12 : 6}
          showHeader={false}
        />
      </div>
      
      {/* Panel Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Click any action to perform</span>
          <span className="px-2 py-1 bg-gray-200 rounded">
            {isExpanded ? 'Expanded' : 'Compact'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;