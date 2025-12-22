// src/components/dashboard/InventoryChart.tsx
import React, { useState } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const InventoryChart: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<'quantity' | 'value'>('quantity');

  const data = {
    categories: ['Electronics', 'Office Supplies', 'Raw Materials', 'Finished Goods', 'Packaging'],
    quantity: [245, 189, 456, 218, 140],
    value: [89500, 23750, 67800, 48900, 19000]
  };

  const maxValue = Math.max(...(activeDataset === 'quantity' ? data.quantity : data.value));
  
  const getColor = (index: number) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveDataset('quantity')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeDataset === 'quantity'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Quantity
          </button>
          <button
            onClick={() => setActiveDataset('value')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeDataset === 'value'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            By Value
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          Total: {activeDataset === 'quantity' 
            ? data.quantity.reduce((a, b) => a + b, 0).toLocaleString() 
            : '$' + data.value.reduce((a, b) => a + b, 0).toLocaleString()}
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="relative pt-8">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 0.25, 0.5, 0.75, 1].map((position) => (
            <div
              key={position}
              className="border-t border-gray-100"
              style={{ marginTop: `${position * 100}%` }}
            />
          ))}
        </div>

        {/* Bars */}
        <div className="relative flex items-end justify-between h-64">
          {data.categories.map((category, index) => {
            const value = activeDataset === 'quantity' ? data.quantity[index] : data.value[index];
            const percentage = (value / maxValue) * 100;
            const color = getColor(index);
            
            return (
              <div key={category} className="flex flex-col items-center w-1/5 px-2">
                {/* Value Label */}
                <div className="text-xs font-medium text-gray-700 mb-2">
                  {activeDataset === 'quantity' 
                    ? value.toLocaleString() 
                    : '$' + value.toLocaleString()}
                </div>
                
                {/* Bar */}
                <div
                  className="w-3/4 rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{
                    height: `${percentage}%`,
                    backgroundColor: color,
                    minHeight: '8px'
                  }}
                >
                  {/* Bar Fill Animation */}
                  <div 
                    className="h-full rounded-t-lg opacity-90"
                    style={{ 
                      background: `linear-gradient(to top, ${color}, ${color}CC)`,
                      animation: 'fillBar 1s ease-out'
                    }}
                  />
                </div>
                
                {/* Category Label */}
                <div className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                  {category}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
          {data.categories.map((category, index) => (
            <div key={category} className="flex items-center">
              <div 
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: getColor(index) }}
              />
              <span className="text-xs text-gray-700">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-700 font-medium">Top Category</div>
              <div className="text-lg font-bold text-blue-900 mt-1">
                {data.categories[data.quantity.indexOf(Math.max(...data.quantity))]}
              </div>
            </div>
            <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-700 font-medium">Growth</div>
              <div className="text-lg font-bold text-green-900 mt-1">+12.5%</div>
            </div>
            <ChartBarIcon className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryChart;