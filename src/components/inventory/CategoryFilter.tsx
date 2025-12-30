import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
  showAllOption?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onChange,
  showAllOption = true
}) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <FunnelIcon className="w-5 h-5 text-gray-400" />
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-10"
        >
          {showAllOption && (
            <option value="all">All Categories</option>
          )}
          {categories.filter(cat => cat !== 'All Categories').map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default CategoryFilter;