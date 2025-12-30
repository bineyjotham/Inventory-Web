// src/components/dashboard/QuickActions.tsx
import React, { useState } from 'react';
import { UserRole } from '../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { 
  PlusIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  TruckIcon,
  UserPlusIcon,
  CogIcon,
  QrCodeIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  ClipboardDocumentListIcon,
  PrinterIcon,
  BellIcon,
  ShoppingCartIcon,
  TagIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentCheckIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo' | 'pink';
  roles: UserRole[];
  action: () => void | Promise<void>;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface QuickActionsProps {
  userRole: UserRole;
  maxItems?: number;
  showHeader?: boolean;
  compact?: boolean;
  onActionClick?: (actionId: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  userRole = 'staff',
  maxItems = 6,
  showHeader = true,
  compact = false,
  onActionClick
}) => {
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleAddItem = async () => {
    setShowAddItemModal(true);
    if (onActionClick) onActionClick('add-item');
  };

  const handleRecordMovement = async () => {
    setShowMovementModal(true);
    if (onActionClick) onActionClick('record-movement');
  };

  const handleGenerateReport = async () => {
    setShowReportModal(true);
    if (onActionClick) onActionClick('generate-report');
  };

  const handleManageSuppliers = async () => {
    console.log('Navigating to suppliers...');
    if (onActionClick) onActionClick('manage-suppliers');
  };

  const handleUserManagement = async () => {
    console.log('Opening user management...');
    if (onActionClick) onActionClick('user-management');
  };

  const handleSystemSettings = async () => {
    console.log('Opening system settings...');
    if (onActionClick) onActionClick('system-settings');
  };

  const handleScanBarcode = async () => {
    console.log('Opening barcode scanner...');
    if (onActionClick) onActionClick('scan-barcode');
  };

  const handleSearchItem = async () => {
    console.log('Opening advanced search...');
    if (onActionClick) onActionClick('search-item');
  };

  const handleLowStockAlert = async () => {
    console.log('Viewing low stock alerts...');
    if (onActionClick) onActionClick('low-stock-alert');
  };

  const handleCreateOrder = async () => {
    console.log('Creating purchase order...');
    if (onActionClick) onActionClick('create-order');
  };

  const handlePrintLabels = async () => {
    console.log('Opening label printer...');
    if (onActionClick) onActionClick('print-labels');
  };

  const handleSetReminder = async () => {
    console.log('Setting reminder...');
    if (onActionClick) onActionClick('set-reminder');
  };

  const handleInventoryCount = async () => {
    console.log('Starting inventory count...');
    if (onActionClick) onActionClick('inventory-count');
  };

  const handlePriceUpdate = async () => {
    console.log('Updating prices...');
    if (onActionClick) onActionClick('price-update');
  };

  const handleBackupData = async () => {
    console.log('Backing up data...');
    if (onActionClick) onActionClick('backup-data');
  };

  const handleViewAuditLog = async () => {
    console.log('Viewing audit log...');
    if (onActionClick) onActionClick('view-audit-log');
  };

  const handleApproveRequest = async () => {
    console.log('Approving requests...');
    if (onActionClick) onActionClick('approve-request');
  };

  const handleCalculateValue = async () => {
    console.log('Calculating inventory value...');
    if (onActionClick) onActionClick('calculate-value');
  };

  const allActions: QuickAction[] = [
    {
      id: 'add-item',
      title: 'Add New Item',
      description: 'Add a new item to inventory',
      icon: PlusIcon,
      color: 'blue',
      roles: ['admin', 'manager'],
      action: handleAddItem
    },
    {
      id: 'record-movement',
      title: 'Record Movement',
      description: 'Record incoming or outgoing stock',
      icon: ArrowsRightLeftIcon,
      color: 'green',
      roles: ['admin', 'manager', 'staff'],
      action: handleRecordMovement
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create inventory or financial report',
      icon: ChartBarIcon,
      color: 'purple',
      roles: ['admin', 'manager'],
      action: handleGenerateReport
    },
    {
      id: 'manage-suppliers',
      title: 'Manage Suppliers',
      description: 'View and manage supplier information',
      icon: TruckIcon,
      color: 'orange',
      roles: ['admin', 'manager'],
      action: handleManageSuppliers
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Add or manage system users',
      icon: UserPlusIcon,
      color: 'indigo',
      roles: ['admin'],
      action: handleUserManagement
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: CogIcon,
      color: 'pink',
      roles: ['admin'],
      action: handleSystemSettings
    },
    {
      id: 'scan-barcode',
      title: 'Scan Barcode',
      description: 'Quick scan using barcode scanner',
      icon: QrCodeIcon,
      color: 'blue',
      roles: ['admin', 'manager', 'staff'],
      action: handleScanBarcode
    },
    {
      id: 'search-item',
      title: 'Search Item',
      description: 'Advanced item search',
      icon: MagnifyingGlassIcon,
      color: 'green',
      roles: ['admin', 'manager', 'staff'],
      action: handleSearchItem
    },
    {
      id: 'low-stock-alert',
      title: 'Low Stock Alerts',
      description: 'View items below minimum stock',
      icon: ExclamationCircleIcon,
      color: 'red',
      roles: ['admin', 'manager', 'staff'],
      action: handleLowStockAlert
    },
    {
      id: 'create-order',
      title: 'Create Order',
      description: 'Create new purchase order',
      icon: ShoppingCartIcon,
      color: 'orange',
      roles: ['admin', 'manager'],
      action: handleCreateOrder
    },
    {
      id: 'print-labels',
      title: 'Print Labels',
      description: 'Print barcode or item labels',
      icon: PrinterIcon,
      color: 'purple',
      roles: ['admin', 'manager', 'staff'],
      action: handlePrintLabels
    },
    {
      id: 'set-reminder',
      title: 'Set Reminder',
      description: 'Set reminder for inventory tasks',
      icon: BellIcon,
      color: 'indigo',
      roles: ['admin', 'manager'],
      action: handleSetReminder
    },
    {
      id: 'inventory-count',
      title: 'Inventory Count',
      description: 'Start physical inventory count',
      icon: ClipboardDocumentListIcon,
      color: 'blue',
      roles: ['admin', 'manager', 'staff'],
      action: handleInventoryCount
    },
    {
      id: 'price-update',
      title: 'Update Prices',
      description: 'Batch update item prices',
      icon: TagIcon,
      color: 'green',
      roles: ['admin', 'manager'],
      action: handlePriceUpdate
    },
    {
      id: 'backup-data',
      title: 'Backup Data',
      description: 'Create system backup',
      icon: ArrowPathIcon,
      color: 'pink',
      roles: ['admin'],
      action: handleBackupData,
      requiresConfirmation: true,
      confirmationMessage: 'Are you sure you want to create a system backup?'
    },
    {
      id: 'view-audit-log',
      title: 'View Audit Log',
      description: 'View system activity log',
      icon: DocumentCheckIcon,
      color: 'indigo',
      roles: ['admin'],
      action: handleViewAuditLog
    },
    {
      id: 'approve-request',
      title: 'Approve Requests',
      description: 'Review and approve pending requests',
      icon: UsersIcon,
      color: 'green',
      roles: ['admin', 'manager'],
      action: handleApproveRequest
    },
    {
      id: 'calculate-value',
      title: 'Calculate Value',
      description: 'Calculate total inventory value',
      icon: CalculatorIcon,
      color: 'purple',
      roles: ['admin', 'manager'],
      action: handleCalculateValue
    }
  ];

  const filteredActions = allActions
    .filter(action => action.roles.includes(userRole))
    .slice(0, maxItems);

  const handleActionClick = async (action: QuickAction) => {
    if (loadingActions.has(action.id)) return;

    if (action.requiresConfirmation) {
      setShowConfirmation(action.id);
      return;
    }

    setLoadingActions(prev => new Set(prev).add(action.id));
    
    try {
      await action.action();
    } catch (error) {
      console.error(`Error executing action ${action.id}:`, error);
    } finally {
      setLoadingActions(prev => {
        const next = new Set(prev);
        next.delete(action.id);
        return next;
      });
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-100',
        icon: 'text-blue-600',
        hover: 'hover:bg-blue-100'
      };
      case 'green': return {
        bg: 'bg-green-50',
        iconBg: 'bg-green-100',
        icon: 'text-green-600',
        hover: 'hover:bg-green-100'
      };
      case 'red': return {
        bg: 'bg-red-50',
        iconBg: 'bg-red-100',
        icon: 'text-red-600',
        hover: 'hover:bg-red-100'
      };
      case 'orange': return {
        bg: 'bg-orange-50',
        iconBg: 'bg-orange-100',
        icon: 'text-orange-600',
        hover: 'hover:bg-orange-100'
      };
      case 'purple': return {
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-100',
        icon: 'text-purple-600',
        hover: 'hover:bg-purple-100'
      };
      case 'indigo': return {
        bg: 'bg-indigo-50',
        iconBg: 'bg-indigo-100',
        icon: 'text-indigo-600',
        hover: 'hover:bg-indigo-100'
      };
      case 'pink': return {
        bg: 'bg-pink-50',
        iconBg: 'bg-pink-100',
        icon: 'text-pink-600',
        hover: 'hover:bg-pink-100'
      };
      default: return {
        bg: 'bg-gray-50',
        iconBg: 'bg-gray-100',
        icon: 'text-gray-600',
        hover: 'hover:bg-gray-100'
      };
    }
  };

  const renderCompactView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {filteredActions.map((action) => {
        const Icon = action.icon;
        const colors = getColorClasses(action.color);
        const isLoading = loadingActions.has(action.id);
        
        return (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            disabled={isLoading}
            className={`${colors.bg} ${colors.hover} border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group`}
            title={action.description}
          >
            <div className={`${colors.iconBg} p-3 rounded-lg mb-3 group-hover:scale-110 transition-transform`}>
              {isLoading ? (
                <ArrowPathIcon className="w-6 h-6 animate-spin text-gray-600" />
              ) : (
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              )}
            </div>
            <span className="text-sm font-medium text-gray-900 text-center truncate w-full">
              {action.title}
            </span>
          </button>
        );
      })}
    </div>
  );

  const renderDetailedView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredActions.map((action) => {
        const Icon = action.icon;
        const colors = getColorClasses(action.color);
        const isLoading = loadingActions.has(action.id);
        
        return (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            disabled={isLoading}
            className={`${colors.bg} ${colors.hover} border border-gray-200 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group`}
          >
            <div className="flex items-start gap-4">
              <div className={`${colors.iconBg} p-3 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {isLoading ? (
                  <ArrowPathIcon className="w-6 h-6 animate-spin text-gray-600" />
                ) : (
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1 truncate">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {action.description}
                </p>
                
                {action.requiresConfirmation && (
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                    Requires confirmation
                  </div>
                )}
              </div>
            </div>
            
            {/* Progress indicator for loading state */}
            {isLoading && (
              <div className="mt-3">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">Processing...</p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  // Modal for adding new item (simplified)
  const AddItemModal = () => (
    <Modal
      isOpen={showAddItemModal}
      onClose={() => setShowAddItemModal(false)}
      title="Add New Inventory Item"
      size="lg"
    >
      <div className="space-y-4">
        <p className="text-gray-600">This would open a form to add a new inventory item.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowAddItemModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowAddItemModal(false)}>
            Add Item
          </Button>
        </div>
      </div>
    </Modal>
  );

  // Confirmation modal
  const ConfirmationModal = () => {
    const action = allActions.find(a => a.id === showConfirmation);
    
    if (!action) return null;

    return (
      <Modal
        isOpen={!!showConfirmation}
        onClose={() => setShowConfirmation(null)}
        title="Confirm Action"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <ExclamationCircleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-900">Confirm Action</p>
              <p className="text-sm text-yellow-700 mt-1">{action.confirmationMessage}</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowConfirmation(null)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={async () => {
                setShowConfirmation(null);
                await handleActionClick(action);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  // Empty state
  if (filteredActions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Quick Actions Available</h3>
        <p className="text-gray-600">
          You don't have permission to perform any quick actions with your current role ({userRole}).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {showHeader && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-600 mt-1">
                Perform common tasks quickly based on your role ({userRole})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {filteredActions.length} actions available
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {compact ? renderCompactView() : renderDetailedView()}
        
        {/* View All Actions Button (if more than max) */}
        {allActions.filter(a => a.roles.includes(userRole)).length > maxItems && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => console.log('View all actions')}
              icon={<EyeIcon className="w-4 h-4" />}
            >
              View All Actions ({allActions.filter(a => a.roles.includes(userRole)).length})
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddItemModal />
      <ConfirmationModal />
      
      {/* Additional modals (simplified) */}
      <Modal
        isOpen={showMovementModal}
        onClose={() => setShowMovementModal(false)}
        title="Record Inventory Movement"
      >
        <div className="space-y-4">
          <p className="text-gray-600">This would open a form to record inventory movement.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowMovementModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowMovementModal(false)}>
              Record
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Generate Report"
      >
        <div className="space-y-4">
          <p className="text-gray-600">This would open the report generation interface.</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setShowReportModal(false)}>
              Generate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Convenience components for specific roles
export const AdminQuickActions: React.FC<Omit<QuickActionsProps, 'userRole'>> = (props) => (
  <QuickActions userRole="admin" {...props} />
);

export const ManagerQuickActions: React.FC<Omit<QuickActionsProps, 'userRole'>> = (props) => (
  <QuickActions userRole="manager" {...props} />
);

export const StaffQuickActions: React.FC<Omit<QuickActionsProps, 'userRole'>> = (props) => (
  <QuickActions userRole="staff" {...props} />
);

// Pre-configured quick action sets
export const CommonActions: React.FC<{ userRole: UserRole }> = ({ userRole }) => (
  <QuickActions 
    userRole={userRole}
    maxItems={4}
    compact={true}
    showHeader={false}
  />
);

export const CriticalActions: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
  const criticalActionIds = ['low-stock-alert', 'inventory-count', 'backup-data', 'approve-request'];
  
  return (
    <QuickActions 
      userRole={userRole}
      maxItems={4}
      compact={true}
      showHeader={true}
      onActionClick={(actionId) => {
        if (criticalActionIds.includes(actionId)) {
          console.log(`Critical action: ${actionId}`);
        }
      }}
    />
  );
};

export default QuickActions;