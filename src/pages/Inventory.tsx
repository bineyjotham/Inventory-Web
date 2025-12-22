// // src/pages/Inventory.tsx
// import React, { useState } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import ItemTable from '../components/inventory/ItemTable';
// import ItemForm from '../components/inventory/ItemForm';
// import CategoryFilter from '../components/inventory/CategoryFilter';
// import SearchBar from '../components/common/SearchBar';
// import Button from '../components/common/Button';
// import { PlusIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
// import Modal from '../components/common/Modal';

// const Inventory: React.FC = () => {
//   const { user } = useAuth();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'lastUpdated'>('name');

//   const categories = [
//     'All Categories',
//     'Electronics',
//     'Office Supplies',
//     'Raw Materials',
//     'Finished Goods',
//     'Packaging',
//     'Tools & Equipment'
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
//           <p className="text-gray-600">Manage and track all inventory items</p>
//         </div>
        
//         <div className="flex items-center gap-3">
//           {user?.role === 'admin' && (
//             <Button
//               variant="primary"
//               onClick={() => setShowAddModal(true)}
//               icon={<PlusIcon className="w-4 h-4" />}
//             >
//               Add Item
//             </Button>
//           )}
//           <Button
//             variant="outline"
//             icon={<ArrowDownTrayIcon className="w-4 h-4" />}
//           >
//             Export
//           </Button>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="md:col-span-2">
//             <SearchBar
//               placeholder="Search items by name, SKU, or location..."
//               value={searchQuery}
//               onChange={setSearchQuery}
//             />
//           </div>
//           <div className="flex gap-3">
//             <CategoryFilter
//               categories={categories}
//               selected={selectedCategory}
//               onChange={setSelectedCategory}
//             />
//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value as any)}
//             >
//               <option value="name">Sort by Name</option>
//               <option value="quantity">Sort by Quantity</option>
//               <option value="lastUpdated">Sort by Last Updated</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Inventory Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <ItemTable
//           searchQuery={searchQuery}
//           category={selectedCategory}
//           sortBy={sortBy}
//         />
//       </div>

//       {/* Add Item Modal */}
//       <Modal
//         isOpen={showAddModal}
//         onClose={() => setShowAddModal(false)}
//         title="Add New Inventory Item"
//       >
//         <ItemForm onClose={() => setShowAddModal(false)} />
//       </Modal>
//     </div>
//   );
// };

// export default Inventory;
// src/pages/Inventory.tsx - Updated with ItemTable integration
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ItemTable, { ManagerItemTable, AdminItemTable } from '../components/inventory/ItemTable';
import ItemForm from '../components/inventory/ItemForm';
import CategoryFilter from '../components/inventory/CategoryFilter';
import SearchBar from '../components/common/SearchBar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { 
  PlusIcon, 
  ArrowDownTrayIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';
import { InventoryItem } from '../types';

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'lastUpdated'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    'All Categories',
    'Electronics',
    'Office Supplies',
    'Furniture',
    'Raw Materials',
    'Finished Goods',
    'Packaging'
  ];

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortBy(field as any);
    setSortDirection(direction);
  };

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleDelete = (item: InventoryItem) => {
    if (window.confirm(`Delete ${item.name}? This action cannot be undone.`)) {
      console.log('Deleting item:', item.id);
      // API call to delete item
    }
  };

  const handleExport = async (items: InventoryItem[]) => {
    setIsExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Exporting items:', items);
    setIsExporting(false);
  };

  const handleBulkAction = (action: string, itemIds: string[]) => {
    console.log('Bulk action:', action, 'on items:', itemIds);
    // Handle bulk actions
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setShowItemModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Manage and track all inventory items</p>
        </div>
        
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <Button
              variant="primary"
              onClick={handleAddItem}
              icon={<PlusIcon className="w-4 h-4" />}
            >
              Add Item
            </Button>
          )}
          <Button
            variant="outline"
            icon={<ArrowDownTrayIcon className="w-4 h-4" />}
            loading={isExporting}
            onClick={() => handleExport([])}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SearchBar
              placeholder="Search items by name, SKU, supplier, or location..."
              value={searchQuery}
              onChange={setSearchQuery}
              showFilters={true}
              filters={[
                {
                  id: 'category',
                  label: 'Category',
                  type: 'select',
                  options: categories.slice(1).map(cat => ({ value: cat, label: cat }))
                },
                {
                  id: 'status',
                  label: 'Status',
                  type: 'select',
                  options: [
                    { value: 'in-stock', label: 'In Stock' },
                    { value: 'low-stock', label: 'Low Stock' },
                    { value: 'out-of-stock', label: 'Out of Stock' }
                  ]
                },
                {
                  id: 'supplier',
                  label: 'Supplier',
                  type: 'select',
                  options: [
                    { value: 'TechParts Inc.', label: 'TechParts Inc.' },
                    { value: 'Office Supply Co.', label: 'Office Supply Co.' },
                    { value: 'Global Electronics', label: 'Global Electronics' }
                  ]
                }
              ]}
            />
          </div>
          
          <div className="flex gap-3">
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Sort by Name</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="lastUpdated">Sort by Last Updated</option>
              <option value="value">Sort by Value</option>
            </select>
          </div>
        </div>
      </div>

      {/* Item Table */}
      {user?.role === 'admin' ? (
        <AdminItemTable
          searchQuery={searchQuery}
          category={selectedCategory}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          onItemClick={handleItemClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onExport={handleExport}
          onBulkAction={handleBulkAction}
          pagination={true}
          pageSize={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      ) : user?.role === 'manager' ? (
        <ManagerItemTable
          searchQuery={searchQuery}
          category={selectedCategory}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          onItemClick={handleItemClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onExport={handleExport}
          pagination={true}
          pageSize={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      ) : (
        <ItemTable
          searchQuery={searchQuery}
          category={selectedCategory}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          onItemClick={handleItemClick}
          showActions={false}
          selectable={false}
        />
      )}

      {/* Item Modal */}
      <Modal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Edit Item' : 'Add New Item'}
        size="lg"
      >
        <ItemForm
          item={selectedItem || undefined}
          onClose={() => {
            setShowItemModal(false);
            setSelectedItem(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Inventory;