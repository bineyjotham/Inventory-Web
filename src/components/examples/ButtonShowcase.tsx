// src/components/examples/ButtonShowcase.tsx
import React, { useState } from 'react';
import Button, { ButtonGroup, FabButton } from '../common/Button';
import {
  PlusIcon,
  TrashIcon,
  DocumentIcon,
  CheckIcon,
  ArrowRightIcon,
  CogIcon,
  UserIcon,
  PencilIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CalendarIcon,
  BellIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const ButtonShowcase: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('day');

  const handleAction = (action: string) => {
    setLoading(action);
    setTimeout(() => setLoading(null), 1500);
  };

  const inventoryActions = [
    {
      label: 'Add Item',
      icon: <PlusIcon className="w-4 h-4" />,
      variant: 'primary' as const,
      action: 'add'
    },
    {
      label: 'Edit Item',
      icon: <PencilIcon className="w-4 h-4" />,
      variant: 'outline' as const,
      action: 'edit'
    },
    {
      label: 'View Details',
      icon: <EyeIcon className="w-4 h-4" />,
      variant: 'ghost' as const,
      action: 'view'
    },
    {
      label: 'Delete',
      icon: <TrashIcon className="w-4 h-4" />,
      variant: 'danger' as const,
      action: 'delete'
    }
  ];

  const reportActions = [
    {
      label: 'Generate Report',
      icon: <ChartBarIcon className="w-4 h-4" />,
      variant: 'success' as const
    },
    {
      label: 'Export Data',
      icon: <ArrowDownTrayIcon className="w-4 h-4" />,
      variant: 'outline' as const
    },
    {
      label: 'Import Data',
      icon: <ArrowUpTrayIcon className="w-4 h-4" />,
      variant: 'outline' as const
    }
  ];

  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Button Components</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Inventory Management System</span>
        </div>
      </div>

      {/* Inventory Actions Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {inventoryActions.map((action) => (
            <Button
              key={action.action}
              variant={action.variant}
              icon={action.icon}
              loading={loading === action.action}
              onClick={() => handleAction(action.action)}
              fullWidth
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Report Actions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report & Data Actions</h3>
        <div className="flex flex-wrap gap-3">
          {reportActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              icon={action.icon}
              size="lg"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range Selection</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">View:</span>
          <ButtonGroup>
            <Button
              variant={activeView === 'day' ? 'primary' : 'outline'}
              onClick={() => setActiveView('day')}
              icon={<CalendarIcon className="w-4 h-4" />}
            >
              Day
            </Button>
            <Button
              variant={activeView === 'week' ? 'primary' : 'outline'}
              onClick={() => setActiveView('week')}
            >
              Week
            </Button>
            <Button
              variant={activeView === 'month' ? 'primary' : 'outline'}
              onClick={() => setActiveView('month')}
            >
              Month
            </Button>
            <Button
              variant={activeView === 'year' ? 'primary' : 'outline'}
              onClick={() => setActiveView('year')}
            >
              Year
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Settings</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            icon={<CogIcon className="w-4 h-4" />}
            tooltip="System Settings"
          >
            Settings
          </Button>
          <Button
            variant="outline"
            icon={<UserIcon className="w-4 h-4" />}
            tooltip="User Profile"
          >
            Profile
          </Button>
          <Button
            variant="outline"
            icon={<BellIcon className="w-4 h-4" />}
            tooltip="Notifications"
          >
            Notifications
          </Button>
          <Button
            variant="outline"
            icon={<DocumentIcon className="w-4 h-4" />}
            loading={loading === 'save'}
            onClick={() => handleAction('save')}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <FabButton
            icon={<PlusIcon className="w-6 h-6" />}
            variant="primary"
            tooltip="Add New Item"
            onClick={() => console.log('Add new item')}
          />
          <FabButton
            icon={<CheckIcon className="w-6 h-6" />}
            variant="success"
            tooltip="Approve All"
            onClick={() => console.log('Approve all')}
          />
          <FabButton
            icon={<TrashIcon className="w-6 h-6" />}
            variant="danger"
            tooltip="Delete Selected"
            onClick={() => console.log('Delete selected')}
          />
          <FabButton
            icon={<ArrowDownTrayIcon className="w-6 h-6" />}
            variant="outline"
            tooltip="Export Data"
            onClick={() => console.log('Export data')}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Actions</h3>
        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 rounded-lg">
          <Button
            variant="ghost"
            onClick={() => console.log('Cancel')}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Save as draft')}
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            icon={<ArrowRightIcon className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => console.log('Submit')}
          >
            Submit Form
          </Button>
        </div>
      </div>

      {/* Status Buttons */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Indicators</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="success" icon={<CheckIcon className="w-4 h-4" />}>
            Active
          </Button>
          <Button variant="warning" icon={<BellIcon className="w-4 h-4" />}>
            Pending
          </Button>
          <Button variant="danger" icon={<TrashIcon className="w-4 h-4" />}>
            Inactive
          </Button>
          <Button variant="outline" icon={<EyeIcon className="w-4 h-4" />}>
            Archived
          </Button>
        </div>
      </div>

      {/* Responsive Example */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsive Example</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            These buttons adjust their size and layout based on screen width:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="primary" fullWidth>
              Mobile: Full Width
            </Button>
            <Button variant="outline" fullWidth>
              Tablet: 2 Columns
            </Button>
            <Button variant="ghost" fullWidth>
              Desktop: 4 Columns
            </Button>
            <Button variant="danger" fullWidth>
              Responsive
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;