// src/components/reports/ReportPreview.tsx
import React from 'react';
import { Report } from '../../types';
import Button from '../common/Button';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  PrinterIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface ReportPreviewProps {
  report: Report;
  onClose: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ report, onClose }) => {
  // Mock report data for preview
  const reportData = {
    summary: {
      totalItems: 1248,
      totalValue: '$248,950',
      lowStockItems: 24,
      outOfStockItems: 5
    },
    categories: [
      { name: 'Electronics', count: 245, value: '$89,500' },
      { name: 'Office Supplies', count: 189, value: '$23,750' },
      { name: 'Raw Materials', count: 456, value: '$67,800' },
      { name: 'Finished Goods', count: 218, value: '$48,900' },
      { name: 'Packaging', count: 140, value: '$19,000' }
    ],
    topItems: [
      { name: 'Laptop Pro 15"', sku: 'ITM-001', quantity: 45, value: '$67,500' },
      { name: 'Monitor 27" 4K', sku: 'ITM-003', quantity: 32, value: '$25,600' },
      { name: 'Wireless Mouse', sku: 'ITM-002', quantity: 128, value: '$6,400' },
      { name: 'Desk Chair', sku: 'ITM-004', quantity: 28, value: '$22,400' },
      { name: 'USB-C Cables', sku: 'ITM-005', quantity: 250, value: '$2,500' }
    ],
    movements: {
      inbound: 245,
      outbound: 189,
      adjustments: 8
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{report.title}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>Period: {report.period}</span>
              <span>•</span>
              <span>Generated: {new Date(report.generatedAt).toLocaleString()}</span>
              <span>•</span>
              <span>Type: {report.type.charAt(0).toUpperCase() + report.type.slice(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" icon={<PrinterIcon className="w-4 h-4" />}>
              Print
            </Button>
            <Button variant="primary" icon={<DocumentArrowDownIcon className="w-4 h-4" />}>
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {/* Company Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">StockMaster Pro</h1>
              <p className="text-gray-600">Inventory Management System</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">Report ID: {report.id}</div>
              <div className="text-sm text-gray-600">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-700 font-medium">Total Inventory Value</div>
              <div className="text-2xl font-bold text-blue-900">{reportData.summary.totalValue}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-700 font-medium">Total Items</div>
              <div className="text-2xl font-bold text-green-900">{reportData.summary.totalItems.toLocaleString()}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-700 font-medium">Low Stock Items</div>
              <div className="text-2xl font-bold text-orange-900">{reportData.summary.lowStockItems}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-700 font-medium">Out of Stock</div>
              <div className="text-2xl font-bold text-red-900">{reportData.summary.outOfStockItems}</div>
            </div>
          </div>
        </div>

        {/* Inventory by Category */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Category</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Count</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.categories.map((category, index) => (
                  <tr key={category.name}>
                    <td className="px-4 py-3 text-sm text-gray-900">{category.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{category.count}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{category.value}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(category.count / reportData.summary.totalItems) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {Math.round((category.count / reportData.summary.totalItems) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Items by Value */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Items by Value</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.topItems.map((item) => (
                  <tr key={item.sku}>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.value}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.quantity > 50 ? 'bg-green-100 text-green-800' :
                        item.quantity > 20 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.quantity > 50 ? 'In Stock' : item.quantity > 20 ? 'Low Stock' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Movement Summary */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Movement Summary (Last 30 Days)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{reportData.movements.inbound}</div>
              <div className="text-sm font-medium text-gray-900">Inbound Items</div>
              <div className="text-xs text-gray-600">Received from suppliers</div>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">{reportData.movements.outbound}</div>
              <div className="text-sm font-medium text-gray-900">Outbound Items</div>
              <div className="text-xs text-gray-600">Dispatched to customers</div>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{reportData.movements.adjustments}</div>
              <div className="text-sm font-medium text-gray-900">Adjustments</div>
              <div className="text-xs text-gray-600">Stock corrections</div>
            </div>
          </div>
        </div>

        {/* Report Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Generated by: StockMaster Pro</div>
              <div className="text-sm text-gray-600">Page 1 of 1</div>
            </div>
            <div className="text-sm text-gray-600">
              Confidential - For Internal Use Only
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Close Preview
        </Button>
        <Button variant="primary" icon={<DocumentArrowDownIcon className="w-4 h-4" />}>
          Download Full Report
        </Button>
        <Button variant="primary" icon={<PrinterIcon className="w-4 h-4" />}>
          Print Report
        </Button>
      </div>
    </div>
  );
};

export default ReportPreview;