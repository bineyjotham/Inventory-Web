// src/components/inventory/ItemTable.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { InventoryItem } from '../../types';
import Button from '../common/Button';
import { 
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  QrCodeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowsUpDownIcon,
  FunnelIcon,
  ClockIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface ItemTableProps {
  items?: InventoryItem[];
  searchQuery?: string;
  category?: string;
  sortBy?: 'name' | 'quantity' | 'lastUpdated' | 'sku' | 'category' | 'value';
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  onItemClick?: (item: InventoryItem) => void;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
  onExport?: (items: InventoryItem[]) => void;
  onBulkAction?: (action: string, itemIds: string[]) => void;
  loading?: boolean;
  showActions?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalItems?: number;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items: propItems,
  searchQuery = '',
  category = 'all',
  sortBy = 'name',
  sortDirection = 'asc',
  onSort,
  onItemClick,
  onEdit,
  onDelete,
  onExport,
  onBulkAction,
  loading = false,
  showActions = true,
  selectable = false,
  pagination = false,
  pageSize = 10,
  onPageChange,
  currentPage = 1,
  totalItems
}) => {
  const { user } = useAuth();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localSortDirection, setLocalSortDirection] = useState(sortDirection);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showOutOfStockOnly, setShowOutOfStockOnly] = useState(false);
  const [localPage, setLocalPage] = useState(currentPage);

  // Mock data if no items provided
  const mockItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Laptop Pro 15"',
      sku: 'ITM-001',
      category: 'Electronics',
      quantity: 45,
      lowStockThreshold: 10,
      unitPrice: 1499.99,
      supplier: 'TechParts Inc.',
      lastUpdated: new Date('2024-01-15'),
      location: 'Warehouse A, Shelf B3',
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'Wireless Mouse',
      sku: 'ITM-002',
      category: 'Electronics',
      quantity: 128,
      lowStockThreshold: 25,
      unitPrice: 49.99,
      supplier: 'Office Supply Co.',
      lastUpdated: new Date('2024-01-14'),
      location: 'Warehouse B, Shelf C1',
      status: 'in-stock'
    },
    {
      id: '3',
      name: 'Monitor 27" 4K',
      sku: 'ITM-003',
      category: 'Electronics',
      quantity: 32,
      lowStockThreshold: 5,
      unitPrice: 799.99,
      supplier: 'Global Electronics',
      lastUpdated: new Date('2024-01-13'),
      location: 'Warehouse A, Shelf A2',
      status: 'in-stock'
    },
    {
      id: '4',
      name: 'Desk Chair',
      sku: 'ITM-004',
      category: 'Furniture',
      quantity: 28,
      lowStockThreshold: 5,
      unitPrice: 399.99,
      supplier: 'Quality Furniture Ltd.',
      lastUpdated: new Date('2024-01-12'),
      location: 'Warehouse C, Shelf D4',
      status: 'low-stock'
    },
    {
      id: '5',
      name: 'USB-C Cables',
      sku: 'ITM-005',
      category: 'Electronics',
      quantity: 250,
      lowStockThreshold: 50,
      unitPrice: 9.99,
      supplier: 'TechParts Inc.',
      lastUpdated: new Date('2024-01-11'),
      location: 'Warehouse B, Shelf A1',
      status: 'in-stock'
    },
    {
      id: '6',
      name: 'Printer Paper',
      sku: 'ITM-006',
      category: 'Office Supplies',
      quantity: 8,
      lowStockThreshold: 20,
      unitPrice: 29.99,
      supplier: 'Office Supply Co.',
      lastUpdated: new Date('2024-01-10'),
      location: 'Warehouse A, Shelf C3',
      status: 'low-stock'
    },
    {
      id: '7',
      name: 'External SSD 1TB',
      sku: 'ITM-007',
      category: 'Electronics',
      quantity: 0,
      lowStockThreshold: 5,
      unitPrice: 129.99,
      supplier: 'Global Electronics',
      lastUpdated: new Date('2024-01-09'),
      location: 'Warehouse B, Shelf B2',
      status: 'out-of-stock'
    },
    {
      id: '8',
      name: 'Notebooks (Pack of 10)',
      sku: 'ITM-008',
      category: 'Office Supplies',
      quantity: 15,
      lowStockThreshold: 10,
      unitPrice: 24.99,
      supplier: 'Office Supply Co.',
      lastUpdated: new Date('2024-01-08'),
      location: 'Warehouse C, Shelf A3',
      status: 'low-stock'
    }
  ];

  const items = propItems || mockItems;

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.supplier.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }

    // Apply stock status filters
    if (showLowStockOnly) {
      filtered = filtered.filter(item => item.status === 'low-stock');
    }
    if (showOutOfStockOnly) {
      filtered = filtered.filter(item => item.status === 'out-of-stock');
    }

    // Apply sorting
    const sortField = onSort ? sortBy : localSortBy;
    const sortDir = onSort ? sortDirection : localSortDirection;

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'sku':
          aValue = a.sku;
          bValue = b.sku;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'value':
          aValue = a.quantity * a.unitPrice;
          bValue = b.quantity * b.unitPrice;
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated).getTime();
          bValue = new Date(b.lastUpdated).getTime();
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, searchQuery, category, sortBy, sortDirection, localSortBy, localSortDirection, showLowStockOnly, showOutOfStockOnly, onSort]);

  // Pagination
  const paginatedItems = useMemo(() => {
    if (!pagination) return filteredAndSortedItems;
    
    const startIndex = (localPage - 1) * pageSize;
    return filteredAndSortedItems.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedItems, pagination, localPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / pageSize);

  // Handle sort
  // const handleSort = (field: string) => {
  //   if (onSort) {
  //     const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
  //     onSort(field, newDirection);
  //   } else {
  //     const newDirection = localSortBy === field && localSortDirection === 'asc' ? 'desc' : 'asc';
  //     setLocalSortBy(field);
  //     setLocalSortDirection(newDirection);
  //   }
  // };
type SortField = 'category' | 'name' | 'value' | 'sku' | 'quantity' | 'lastUpdated';

const handleSort = (field: SortField) => {
  if (onSort) {
    const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  } else {
    const newDirection = localSortBy === field && localSortDirection === 'asc' ? 'desc' : 'asc';
    setLocalSortBy(field);
    setLocalSortDirection(newDirection);
  }
};

  // Handle select all
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedItems.map(item => item.id);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  // Handle item select
  const handleItemSelect = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setLocalPage(page);
    if (onPageChange) onPageChange(page);
  };

  // Get status color and icon
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in-stock':
        return {
          color: 'text-green-800 bg-green-100',
          icon: CheckCircleIcon,
          text: 'In Stock'
        };
      case 'low-stock':
        return {
          color: 'text-orange-800 bg-orange-100',
          icon: ExclamationTriangleIcon,
          text: 'Low Stock'
        };
      case 'out-of-stock':
        return {
          color: 'text-red-800 bg-red-100',
          icon: XCircleIcon,
          text: 'Out of Stock'
        };
      default:
        return {
          color: 'text-gray-800 bg-gray-100',
          icon: ClockIcon,
          text: 'Unknown'
        };
    }
  };

  // Calculate item value
  const calculateValue = (item: InventoryItem) => {
    return (item.quantity * item.unitPrice).toFixed(2);
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (onBulkAction && selectedItems.size > 0) {
      onBulkAction(action, Array.from(selectedItems));
    }
  };

  // Export selected items
  const handleExportSelected = () => {
    const selectedItemsList = items.filter(item => selectedItems.has(item.id));
    if (onExport) {
      onExport(selectedItemsList);
    } else {
      console.log('Exporting items:', selectedItemsList);
      // In real app, trigger download
    }
  };

  // Clear filters
  const clearFilters = () => {
    setShowLowStockOnly(false);
    setShowOutOfStockOnly(false);
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    <tbody>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          {selectable && (
            <td className="px-6 py-4">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </td>
          )}
          <td className="px-6 py-4">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </td>
          {showActions && (
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header with Controls */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {selectable && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.size === paginatedItems.length && paginatedItems.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {selectedItems.size > 0 ? `${selectedItems.size} selected` : 'Select all'}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  showLowStockOnly
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                Low Stock
              </button>
              
              <button
                onClick={() => setShowOutOfStockOnly(!showOutOfStockOnly)}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  showOutOfStockOnly
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <XCircleIcon className="w-4 h-4" />
                Out of Stock
              </button>
              
              {(showLowStockOnly || showOutOfStockOnly) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedItems.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  {selectedItems.size} item(s) selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<ArrowDownTrayIcon className="w-4 h-4" />}
                  onClick={handleExportSelected}
                >
                  Export
                </Button>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <div className="relative group">
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<ArrowsUpDownIcon className="w-4 h-4" />}
                    >
                      Bulk Actions
                    </Button>
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleBulkAction('adjust_quantity')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Adjust Quantity
                        </button>
                        <button
                          onClick={() => handleBulkAction('update_prices')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Update Prices
                        </button>
                        <button
                          onClick={() => handleBulkAction('change_category')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Change Category
                        </button>
                        <button
                          onClick={() => handleBulkAction('print_labels')}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Print Labels
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleBulkAction('delete')}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete Items
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-sm text-gray-600">
              {filteredAndSortedItems.length} item(s) found
              {filteredAndSortedItems.length !== items.length && (
                <span className="ml-1 text-gray-400">
                  (filtered from {items.length})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === paginatedItems.length && paginatedItems.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Item Name
                  {((onSort ? sortBy : localSortBy) === 'name') && (
                    (onSort ? sortDirection : localSortDirection) === 'asc' ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )
                  )}
                </button>
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('sku')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  SKU
                  {((onSort ? sortBy : localSortBy) === 'sku') && (
                    (onSort ? sortDirection : localSortDirection) === 'asc' ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )
                  )}
                </button>
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Category
                  {((onSort ? sortBy : localSortBy) === 'category') && (
                    (onSort ? sortDirection : localSortDirection) === 'asc' ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )
                  )}
                </button>
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('quantity')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Quantity
                  {((onSort ? sortBy : localSortBy) === 'quantity') && (
                    (onSort ? sortDirection : localSortDirection) === 'asc' ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )
                  )}
                </button>
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('value')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Total Value
                  {((onSort ? sortBy : localSortBy) === 'value') && (
                    (onSort ? sortDirection : localSortDirection) === 'asc' ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )
                  )}
                </button>
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              
              {showActions && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {loading ? renderSkeleton() : (
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => {
                  const statusConfig = getStatusConfig(item.status);
                  const StatusIcon = statusConfig.icon;
                  const isLowStock = item.quantity <= item.lowStockThreshold;
                  
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedItems.has(item.id) ? 'bg-blue-50' : ''
                      } ${item.status === 'out-of-stock' ? 'opacity-75' : ''}`}
                    >
                      {selectable && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => handleItemSelect(item.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                      )}
                      
                      <td 
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => onItemClick?.(item)}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            <div className="flex items-center gap-2">
                              <UserCircleIcon className="w-4 h-4" />
                              {item.supplier}
                            </div>
                            <div className="mt-1">{item.location}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-gray-900">{item.sku}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {item.category}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-lg font-semibold text-gray-900">
                              {item.quantity}
                            </div>
                            {isLowStock && item.status !== 'out-of-stock' && (
                              <div className="text-xs text-orange-600">
                                Min: {item.lowStockThreshold}
                              </div>
                            )}
                          </div>
                          {isLowStock && (
                            <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          ${calculateValue(item)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item.unitPrice.toFixed(2)}/unit
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.text}
                        </span>
                      </td>
                      
                      {showActions && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onItemClick?.(item)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => onItemClick?.(item)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Print Label"
                            >
                              <QrCodeIcon className="w-4 h-4" />
                            </button>
                            
                            {(user?.role === 'admin' || user?.role === 'manager') && (
                              <>
                                <button
                                  onClick={() => onEdit?.(item)}
                                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Edit Item"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                
                                {user?.role === 'admin' && (
                                  <button
                                    onClick={() => onDelete?.(item)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Item"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td 
                    colSpan={selectable ? 8 : 7}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FunnelIcon className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No items found
                      </h3>
                      <p className="text-gray-600 max-w-md">
                        {searchQuery || category !== 'all' || showLowStockOnly || showOutOfStockOnly
                          ? 'Try adjusting your search or filter criteria'
                          : 'No inventory items found. Add your first item to get started.'}
                      </p>
                      {searchQuery || category !== 'all' || showLowStockOnly || showOutOfStockOnly ? (
                        <button
                          onClick={clearFilters}
                          className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          Clear all filters
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(localPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(localPage * pageSize, filteredAndSortedItems.length)}
              </span>{' '}
              of <span className="font-medium">{filteredAndSortedItems.length}</span> results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(localPage - 1)}
                disabled={localPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (localPage <= 3) {
                    pageNum = i + 1;
                  } else if (localPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = localPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 text-sm font-medium rounded-lg ${
                        localPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && localPage < totalPages - 2 && (
                  <>
                    <span className="px-1">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-8 h-8 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => handlePageChange(localPage + 1)}
                disabled={localPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {filteredAndSortedItems.length}
            </div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredAndSortedItems.filter(i => i.status === 'in-stock').length}
            </div>
            <div className="text-sm text-gray-600">In Stock</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {filteredAndSortedItems.filter(i => i.status === 'low-stock').length}
            </div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {filteredAndSortedItems.filter(i => i.status === 'out-of-stock').length}
            </div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pre-configured table variants
export const CompactItemTable: React.FC<Omit<ItemTableProps, 'showActions' | 'selectable'>> = (props) => (
  <ItemTable
    {...props}
    showActions={false}
    selectable={false}
  />
);

export const SelectableItemTable: React.FC<Omit<ItemTableProps, 'selectable'>> = (props) => (
  <ItemTable
    {...props}
    selectable={true}
  />
);

export const ManagerItemTable: React.FC<ItemTableProps> = (props) => (
  <ItemTable
    {...props}
    selectable={true}
    showActions={true}
    pagination={true}
  />
);

export const AdminItemTable: React.FC<ItemTableProps> = (props) => (
  <ItemTable
    {...props}
    selectable={true}
    showActions={true}
    pagination={true}
    onBulkAction={(action, ids) => {
      console.log('Admin bulk action:', action, ids);
    }}
  />
);

export default ItemTable;