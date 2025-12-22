// src/pages/Suppliers.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SupplierForm from '../components/suppliers/SuppliersForm';
import { 
  PlusIcon, 
  ArrowDownTrayIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  CubeIcon,
  ChartBarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { Supplier } from '../types';

const Suppliers: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Mock suppliers data
  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'TechParts Inc.',
      contactPerson: 'John Smith',
      email: 'john@techparts.com',
      phone: '+1 (555) 123-4567',
      itemsSupplied: 45,
      status: 'active'
    },
    {
      id: '2',
      name: 'Office Supply Co.',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@officesupply.com',
      phone: '+1 (555) 987-6543',
      itemsSupplied: 28,
      status: 'active'
    },
    {
      id: '3',
      name: 'Global Electronics',
      contactPerson: 'Mike Chen',
      email: 'mike@globalelectronics.com',
      phone: '+1 (555) 456-7890',
      itemsSupplied: 62,
      status: 'active'
    },
    {
      id: '4',
      name: 'Quality Furniture Ltd.',
      contactPerson: 'Emma Wilson',
      email: 'emma@qualityfurniture.com',
      phone: '+1 (555) 234-5678',
      itemsSupplied: 18,
      status: 'inactive'
    },
    {
      id: '5',
      name: 'Packaging Solutions',
      contactPerson: 'Robert Brown',
      email: 'robert@packagingsolutions.com',
      phone: '+1 (555) 345-6789',
      itemsSupplied: 31,
      status: 'active'
    }
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
          <p className="text-gray-600">Manage your supplier network and relationships</p>
        </div>
        
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <Button
              variant="primary"
              onClick={() => {
                setSelectedSupplier(null);
                setShowAddModal(true);
              }}
              icon={<PlusIcon className="w-4 h-4" />}
            >
              Add Supplier
            </Button>
          )}
          <Button
            variant="outline"
            icon={<ArrowDownTrayIcon className="w-4 h-4" />}
          >
            Export List
          </Button>
        </div>
      </div>

      {/* Supplier Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{suppliers.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {suppliers.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items Supplied</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {suppliers.reduce((sum, s) => sum + s.itemsSupplied, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <CubeIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Items/Supplier</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(suppliers.reduce((sum, s) => sum + s.itemsSupplied, 0) / suppliers.length)}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Suppliers</label>
            <SearchBar
              placeholder="Search by name, contact, or email..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <div className="flex gap-2">
              {['all', 'active', 'inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{supplier.name}</h3>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      supplier.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {supplier.status === 'active' ? (
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircleIcon className="w-3 h-3 mr-1" />
                      )}
                      {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <UserCircleIcon className="w-4 h-4" />
                  <span>{supplier.contactPerson}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <EnvelopeIcon className="w-4 h-4" />
                  <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:text-blue-800">
                    {supplier.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4" />
                  <a href={`tel:${supplier.phone}`} className="text-blue-600 hover:text-blue-800">
                    {supplier.phone}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Items Supplied
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {supplier.itemsSupplied}
                  </div>
                </div>
              </div>

              {(user?.role === 'admin' || user?.role === 'manager') && (
                <div className="mt-6 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSupplier(supplier)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    View Items
                  </Button>
                  {user?.role === 'admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Deactivate
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <BuildingOfficeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          {user?.role === 'admin' && (
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              icon={<PlusIcon className="w-4 h-4" />}
            >
              Add Your First Supplier
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Supplier Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedSupplier(null);
        }}
        title={selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        size="lg"
      >
        <SupplierForm 
          supplier={selectedSupplier || undefined}
          onClose={() => {
            setShowAddModal(false);
            setSelectedSupplier(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Suppliers;