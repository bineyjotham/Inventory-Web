// src/pages/Movements.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import MovementForm from '../components/movements/MovementForm';
import { 
  PlusIcon, 
  ArrowDownTrayIcon,
  FunnelIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  ClockIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { InventoryMovement } from '../types';

const Movements: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'inbound' | 'outbound' | 'adjustment'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Mock movements data
  const movements: InventoryMovement[] = [
    {
      id: '1',
      itemId: 'ITM-001',
      itemName: 'Laptop Pro 15"',
      type: 'inbound',
      quantity: 50,
      user: 'Sarah Miller',
      date: new Date('2024-01-15T10:30:00'),
      reference: 'PO-2024-001',
      notes: 'Quarterly restock'
    },
    {
      id: '2',
      itemId: 'ITM-002',
      itemName: 'Wireless Mouse',
      type: 'outbound',
      quantity: 25,
      user: 'Mike Wilson',
      date: new Date('2024-01-15T14:20:00'),
      reference: 'SO-2024-045',
      notes: 'Office supply order'
    },
    {
      id: '3',
      itemId: 'ITM-003',
      itemName: 'Monitor 27" 4K',
      type: 'adjustment',
      quantity: -2,
      user: 'Alex Johnson',
      date: new Date('2024-01-14T16:45:00'),
      reference: 'ADJ-2024-012',
      notes: 'Damaged during handling'
    },
    {
      id: '4',
      itemId: 'ITM-004',
      itemName: 'Desk Chair',
      type: 'inbound',
      quantity: 30,
      user: 'Sarah Miller',
      date: new Date('2024-01-14T11:15:00'),
      reference: 'PO-2024-002',
      notes: 'New office setup'
    },
    {
      id: '5',
      itemId: 'ITM-005',
      itemName: 'USB-C Cables',
      type: 'outbound',
      quantity: 100,
      user: 'Mike Wilson',
      date: new Date('2024-01-13T09:30:00'),
      reference: 'SO-2024-046',
      notes: 'Department distribution'
    }
  ];

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movement.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movement.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || movement.type === selectedType;
    
    // Date filtering (simplified)
    const movementDate = new Date(movement.date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - movementDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const matchesDate = dateRange === 'all' || 
                       (dateRange === 'today' && daysDiff === 0) ||
                       (dateRange === 'week' && daysDiff <= 7) ||
                       (dateRange === 'month' && daysDiff <= 30);
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'inbound': return 'bg-green-100 text-green-800';
      case 'outbound': return 'bg-red-100 text-red-800';
      case 'adjustment': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inbound': return <ArrowDownCircleIcon className="w-5 h-5" />;
      case 'outbound': return <ArrowUpCircleIcon className="w-5 h-5" />;
      case 'adjustment': return <AdjustmentsHorizontalIcon className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Movements</h1>
          <p className="text-gray-600">Track all incoming, outgoing, and adjustment transactions</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => setShowRecordModal(true)}
            icon={<PlusIcon className="w-4 h-4" />}
          >
            Record Movement
          </Button>
          <Button
            variant="outline"
            icon={<ArrowDownTrayIcon className="w-4 h-4" />}
          >
            Export Log
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Movements</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ClockIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inbound Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">245</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ArrowDownCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outbound Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">189</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <ArrowUpCircleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Adjustments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <AdjustmentsHorizontalIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Movements</label>
            <SearchBar
              placeholder="Search by item, reference, or user..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Movement Type</label>
            <div className="flex gap-2">
              {['all', 'inbound', 'outbound', 'adjustment'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as any)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    selectedType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex gap-2">
              {[
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'all', label: 'All Time' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value as any)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    dateRange === range.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item & Reference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{movement.itemName}</div>
                      <div className="text-sm text-gray-500">{movement.reference}</div>
                      {movement.notes && (
                        <div className="text-xs text-gray-400 mt-1">{movement.notes}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(movement.type)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(movement.type)}`}>
                        {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-lg font-semibold ${
                      movement.type === 'inbound' ? 'text-green-600' :
                      movement.type === 'outbound' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {movement.type === 'inbound' ? '+' : ''}{movement.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <UserCircleIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-900">{movement.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(movement.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(movement.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      {(user?.role === 'admin' || user?.role === 'manager') && (
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredMovements.length === 0 && (
          <div className="text-center py-12">
            <AdjustmentsHorizontalIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No movements found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Record Movement Modal */}
      <Modal
        isOpen={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        title="Record Inventory Movement"
        size="lg"
      >
        <MovementForm onClose={() => setShowRecordModal(false)} />
      </Modal>
    </div>
  );
};

export default Movements;