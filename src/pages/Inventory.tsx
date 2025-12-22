// src/pages/Inventory.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ItemTable from '../components/inventory/ItemTable';
import ItemForm from '../components/inventory/ItemForm';
import CategoryFilter from '../components/inventory/CategoryFilter';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import { PlusIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Modal from '../components/common/Modal';

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'lastUpdated'>('name');

  const categories = [
    'All Categories',
    'Electronics',
    'Office Supplies',
    'Raw Materials',
    'Finished Goods',
    'Packaging',
    'Tools & Equipment'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage and track all inventory items</p>
        </div>
        
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              icon={<PlusIcon className="w-4 h-4" />}
            >
              Add Item
            </Button>
          )}
          <Button
            variant="outline"
            icon={<ArrowDownTrayIcon className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search items by name, SKU, or location..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex gap-3">
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Sort by Name</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="lastUpdated">Sort by Last Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <ItemTable
          searchQuery={searchQuery}
          category={selectedCategory}
          sortBy={sortBy}
        />
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Inventory Item"
      >
        <ItemForm onClose={() => setShowAddModal(false)} />
      </Modal>
    </div>
  );
};

export default Inventory;