import React, { useState } from 'react';
import SearchBar, { 
  CompactSearchBar, 
  FilledSearchBar, 
  MinimalSearchBar, 
  AdvancedSearchBar,
  useSearch,
  SearchFilter
} from '../common/SearchBar';
import Button from '../common/Button';
import {
  MagnifyingGlassIcon,
  CubeIcon,
  TruckIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const SearchBarExamples: React.FC = () => {
  const [query, setQuery] = useState('');
  const [compactQuery, setCompactQuery] = useState('');
  const [filledQuery, setFilledQuery] = useState('');
  const [minimalQuery, setMinimalQuery] = useState('');
  const [advancedQuery, setAdvancedQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchType, setSearchType] = useState('all');
  const [showResults, setShowResults] = useState(false);

  // Using the search hook
  const {
    query: hookQuery,
    setQuery: setHookQuery,
    filters: hookFilters,
    setFilters: setHookFilters,
    isSearching,
    searchResults,
    searchHistory,
    handleSearch: hookHandleSearch,
    clearHistory
  } = useSearch();

  // Mock filters
  const mockFilters: SearchFilter[] = [
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'office', label: 'Office Supplies' },
        { value: 'materials', label: 'Raw Materials' },
        { value: 'finished', label: 'Finished Goods' }
      ]
    },
    {
      id: 'supplier',
      label: 'Supplier',
      type: 'select',
      options: [
        { value: 'techparts', label: 'TechParts Inc.' },
        { value: 'officeco', label: 'Office Supply Co.' },
        { value: 'global', label: 'Global Electronics' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      type: 'checkbox',
      options: [
        { value: 'in-stock', label: 'In Stock' },
        { value: 'low-stock', label: 'Low Stock' },
        { value: 'out-of-stock', label: 'Out of Stock' }
      ]
    },
    {
      id: 'minPrice',
      label: 'Min Price',
      type: 'number',
      placeholder: 'Minimum price'
    },
    {
      id: 'maxPrice',
      label: 'Max Price',
      type: 'number',
      placeholder: 'Maximum price'
    },
    {
      id: 'dateRange',
      label: 'Date Added',
      type: 'date',
      placeholder: 'Select date'
    }
  ];

  // Mock suggestions
  const mockSuggestions = [
    {
      id: '1',
      label: 'Laptop Pro 15"',
      type: 'item' as const,
      description: 'SKU: ITM-001 • Category: Electronics',
      icon: <CubeIcon className="w-4 h-4" />
    },
    {
      id: '2',
      label: 'TechParts Inc.',
      type: 'supplier' as const,
      description: 'Supplier • Electronics & Components',
      icon: <TruckIcon className="w-4 h-4" />
    },
    {
      id: '3',
      label: 'Wireless Mouse',
      type: 'item' as const,
      description: 'SKU: ITM-002 • Category: Electronics',
      icon: <CubeIcon className="w-4 h-4" />
    },
    {
      id: '4',
      label: 'Office Supplies',
      type: 'category' as const,
      description: 'Category • 189 items',
      icon: <TagIcon className="w-4 h-4" />
    }
  ];

  // Search types
  const searchTypes = [
    { id: 'all', label: 'All', icon: <MagnifyingGlassIcon className="w-4 h-4" /> },
    { id: 'items', label: 'Items', icon: <CubeIcon className="w-4 h-4" /> },
    { id: 'suppliers', label: 'Suppliers', icon: <TruckIcon className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <TagIcon className="w-4 h-4" /> }
  ];

  const handleSearch = (searchQuery: string, searchFilters?: Record<string, any>) => {
    console.log('Searching for:', searchQuery);
    console.log('Filters:', searchFilters);
    setShowResults(true);
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-xl">
      <h2 className="text-2xl font-bold text-gray-900">SearchBar Components</h2>

      {/* Default SearchBar */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default SearchBar</h3>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          placeholder="Search inventory items, suppliers, or categories..."
          size="md"
          showSearchButton={true}
          showClearButton={true}
          showSuggestions={true}
          suggestions={mockSuggestions}
        />
        {query && (
          <p className="mt-2 text-sm text-gray-600">
            Current query: <span className="font-medium">{query}</span>
          </p>
        )}
      </div>

      {/* Compact SearchBar */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compact SearchBar</h3>
        <CompactSearchBar
          value={compactQuery}
          onChange={setCompactQuery}
          onSearch={handleSearch}
          placeholder="Quick search..."
        />
        <p className="mt-2 text-sm text-gray-500">
          Perfect for headers or tight spaces
        </p>
      </div>

      {/* Filled SearchBar */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filled SearchBar</h3>
        <FilledSearchBar
          value={filledQuery}
          onChange={setFilledQuery}
          onSearch={handleSearch}
          placeholder="Search with background fill..."
        />
      </div>

      {/* Minimal SearchBar */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Minimal SearchBar</h3>
        <MinimalSearchBar
          value={minimalQuery}
          onChange={setMinimalQuery}
          placeholder="Simple search..."
        />
        <p className="mt-2 text-sm text-gray-500">
          Clean design for minimal interfaces
        </p>
      </div>

      {/* Advanced SearchBar with Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced SearchBar with Filters</h3>
        <AdvancedSearchBar
          value={advancedQuery}
          onChange={setAdvancedQuery}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          placeholder="Search with advanced filters..."
          filters={mockFilters}
          suggestions={mockSuggestions}
          debounceTime={500}
          searchTypes={searchTypes}
          onSearchTypeChange={setSearchType}
          currentSearchType={searchType}
        />
        {Object.keys(filters).length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Active filters: {JSON.stringify(filters)}
            </p>
          </div>
        )}
      </div>

      {/* SearchBar with Hook Example */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">SearchBar with useSearch Hook</h3>
        <SearchBar
          value={hookQuery}
          onChange={setHookQuery}
          onSearch={hookHandleSearch}
          onFilterChange={setHookFilters}
          placeholder="Try the search hook..."
          loading={isSearching}
          filters={mockFilters.slice(0, 3)}
          suggestions={mockSuggestions}
          history={searchHistory}
          onHistoryClear={clearHistory}
          showHistory={true}
          showSuggestions={true}
          showFilters={true}
        />
        
        {isSearching && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Searching...</p>
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Search Results ({searchResults.length})</h4>
            <div className="space-y-2">
              {searchResults.map((result) => (
                <div key={result.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{result.name}</p>
                  <p className="text-sm text-gray-600">{result.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {searchHistory.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Search History</h4>
              <button
                onClick={clearHistory}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setHookQuery(item.query)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                >
                  {item.query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real-world Example: Inventory Search */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Search Example</h3>
        <div className="space-y-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            placeholder="Search by item name, SKU, supplier, or location..."
            filters={[
              {
                id: 'category',
                label: 'Category',
                type: 'select',
                options: [
                  { value: '', label: 'All Categories' },
                  { value: 'electronics', label: 'Electronics' },
                  { value: 'office', label: 'Office Supplies' },
                  { value: 'materials', label: 'Raw Materials' }
                ]
              },
              {
                id: 'status',
                label: 'Stock Status',
                type: 'select',
                options: [
                  { value: '', label: 'All Status' },
                  { value: 'in-stock', label: 'In Stock' },
                  { value: 'low-stock', label: 'Low Stock' },
                  { value: 'out-of-stock', label: 'Out of Stock' }
                ]
              },
              {
                id: 'location',
                label: 'Warehouse',
                type: 'select',
                options: [
                  { value: '', label: 'All Locations' },
                  { value: 'main', label: 'Main Warehouse' },
                  { value: 'west', label: 'West Warehouse' },
                  { value: 'east', label: 'East Warehouse' }
                ]
              }
            ]}
            onFilterChange={handleFilterChange}
            showFilters={true}
            showSearchButton={true}
            size="lg"
            searchTypes={[
              { id: 'items', label: 'Items' },
              { id: 'suppliers', label: 'Suppliers' },
              { id: 'orders', label: 'Orders' }
            ]}
            onSearchTypeChange={setSearchType}
            currentSearchType={searchType}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-700 font-medium">Search Tips</div>
              <ul className="mt-2 space-y-1 text-sm text-blue-600">
                <li>• Use SKU: prefix for SKU search</li>
                <li>• Use cat: for category search</li>
                <li>• Use sup: for supplier search</li>
                <li>• Combine with filters for precise results</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-700 font-medium">Quick Filters</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="xs" variant="outline">Low Stock</Button>
                <Button size="xs" variant="outline">New Items</Button>
                <Button size="xs" variant="outline">Needs Reorder</Button>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-700 font-medium">Recent Searches</div>
              <div className="mt-2 space-y-1">
                <button className="text-sm text-purple-600 hover:text-purple-800 block">
                  Laptop Pro 15"
                </button>
                <button className="text-sm text-purple-600 hover:text-purple-800 block">
                  Wireless Mouse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Example */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsive Behavior</h3>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            This search bar adapts to different screen sizes:
          </p>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Desktop (lg+)</p>
              <SearchBar
                value=""
                onChange={() => {}}
                placeholder="Full features on desktop..."
                showFilters={true}
                showSearchButton={true}
                size="lg"
              />
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Tablet (md)</p>
              <SearchBar
                value=""
                onChange={() => {}}
                placeholder="Simplified on tablet..."
                showFilters={false}
                showSearchButton={true}
                size="md"
              />
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Mobile (sm)</p>
              <CompactSearchBar
                value=""
                onChange={() => {}}
                placeholder="Compact on mobile..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBarExamples;