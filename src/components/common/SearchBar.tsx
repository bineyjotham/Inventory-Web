// src/components/common/SearchBar.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  FunnelIcon,
  ClockIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import Button from './Button';

export interface SearchFilter {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'checkbox';
  options?: Array<{ value: string; label: string }>;
  value?: any;
  placeholder?: string;
}

export interface SearchSuggestion {
  id: string;
  label: string;
  type: 'item' | 'category' | 'supplier' | 'sku';
  description?: string;
  icon?: React.ReactNode;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  filters?: Record<string, any>;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string, filters?: Record<string, any>) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline' | 'minimal';
  showSearchButton?: boolean;
  showClearButton?: boolean;
  showFilters?: boolean;
  showSuggestions?: boolean;
  showHistory?: boolean;
  debounceTime?: number;
  maxSuggestions?: number;
  maxHistoryItems?: number;
  filters?: SearchFilter[];
  onFilterChange?: (filters: Record<string, any>) => void;
  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  history?: SearchHistoryItem[];
  onHistoryClear?: () => void;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  searchTypes?: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  onSearchTypeChange?: (type: string) => void;
  currentSearchType?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search...',
  disabled = false,
  loading = false,
  autoFocus = false,
  size = 'md',
  variant = 'default',
  showSearchButton = true,
  showClearButton = true,
  showFilters = false,
  showSuggestions = true,
  showHistory = true,
  debounceTime = 300,
  maxSuggestions = 5,
  maxHistoryItems = 5,
  filters = [],
  onFilterChange,
  suggestions = [],
  onSuggestionSelect,
  history = [],
  onHistoryClear,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  dropdownClassName = '',
  searchTypes = [],
  onSearchTypeChange,
  currentSearchType = 'all'
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout>(null);

  // Size classes
  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-sm',
    lg: 'h-14 text-base'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-white border border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500',
    filled: 'bg-gray-100 border border-transparent hover:bg-gray-200 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500',
    outline: 'bg-transparent border border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500',
    minimal: 'bg-transparent border-0 border-b border-gray-300 hover:border-gray-400 focus-within:border-blue-500'
  };

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce implementation
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (localValue !== value) {
      setIsDebouncing(true);
      debounceTimeout.current = setTimeout(() => {
        setDebouncedValue(localValue);
        onChange(localValue);
        setIsDebouncing(false);
      }, debounceTime);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [localValue, value, onChange, debounceTime]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || (!suggestions.length && !history.length)) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = selectedSuggestionIndex < suggestions.length - 1 
          ? selectedSuggestionIndex + 1 
          : selectedSuggestionIndex;
        setSelectedSuggestionIndex(nextIndex);
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = selectedSuggestionIndex > 0 
          ? selectedSuggestionIndex - 1 
          : selectedSuggestionIndex;
        setSelectedSuggestionIndex(prevIndex);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else if (localValue.trim()) {
          handleSearch();
        }
        break;
      
      case 'Escape':
        setShowDropdown(false);
        setSelectedSuggestionIndex(-1);
        break;
      
      default:
        setSelectedSuggestionIndex(-1);
    }
  }, [showDropdown, suggestions, history, selectedSuggestionIndex, localValue]);

  // Handle search
  const handleSearch = () => {
    if (onSearch && localValue.trim()) {
      onSearch(localValue.trim(), activeFilters);
      setShowDropdown(false);
    }
  };

  // Handle clear
  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (onClear) onClear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle suggestion select
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setLocalValue(suggestion.label);
    onChange(suggestion.label);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle history select
  const handleHistorySelect = (historyItem: SearchHistoryItem) => {
    setLocalValue(historyItem.query);
    onChange(historyItem.query);
    if (onSearch) {
      onSearch(historyItem.query, historyItem.filters);
    }
    setShowDropdown(false);
  };

  // Handle filter change
  const handleFilterChange = (filterId: string, filterValue: any) => {
    const updatedFilters = {
      ...activeFilters,
      [filterId]: filterValue
    };
    setActiveFilters(updatedFilters);
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (localValue || suggestions.length > 0 || history.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (newValue.trim()) {
      setShowDropdown(true);
    }
  };

  // Filter active filters count
  const activeFiltersCount = Object.values(activeFilters).filter(v => 
    v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0)
  ).length;

  // Render search types
  const renderSearchTypes = () => {
    if (!searchTypes.length) return null;

    return (
      <div className="flex border-r border-gray-300">
        {searchTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSearchTypeChange?.(type.id)}
            className={`flex items-center gap-1 px-3 py-1 text-sm font-medium transition-colors ${
              currentSearchType === type.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {type.icon}
            <span className="hidden sm:inline">{type.label}</span>
          </button>
        ))}
      </div>
    );
  };

  // Render filters
  const renderFilters = () => {
    if (!showFilters || !filters.length) return null;

    return (
      <>
        <button
          type="button"
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          className={`relative px-3 border-l border-gray-300 flex items-center gap-2 text-sm font-medium transition-colors ${
            activeFiltersCount > 0
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="Filters"
        >
          <FunnelIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {showFiltersPanel && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Filters</h4>
              <button
                onClick={() => setShowFiltersPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  
                  {filter.type === 'text' && (
                    <input
                      type="text"
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      placeholder={filter.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                  
                  {filter.type === 'select' && (
                    <select
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {filter.type === 'checkbox' && filter.options && (
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Array.isArray(activeFilters[filter.id]) && 
                              activeFilters[filter.id].includes(option.value)}
                            onChange={(e) => {
                              const current = Array.isArray(activeFilters[filter.id]) 
                                ? activeFilters[filter.id] 
                                : [];
                              const updated = e.target.checked
                                ? [...current, option.value]
                                : current.filter(v => v !== option.value);
                              handleFilterChange(filter.id, updated);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setActiveFilters({});
                  if (onFilterChange) onFilterChange({});
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFiltersPanel(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  // Render dropdown content
  const renderDropdownContent = () => {
    if (!showDropdown) return null;

    const hasSuggestions = suggestions.length > 0 && localValue.trim();
    const hasHistory = history.length > 0 && !localValue.trim();
    const hasRecentSearches = history.length > 0 && localValue.trim();

    if (!hasSuggestions && !hasHistory && !hasRecentSearches) return null;

    return (
      <div 
        ref={dropdownRef}
        className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 overflow-hidden ${dropdownClassName}`}
      >
        {/* Suggestions */}
        {hasSuggestions && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Suggestions
              </h4>
            </div>
            <div className="py-1">
              {suggestions.slice(0, maxSuggestions).map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 ${
                    selectedSuggestionIndex === index ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    {suggestion.icon || <MagnifyingGlassIcon className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {suggestion.label}
                    </div>
                    {suggestion.description && (
                      <div className="text-sm text-gray-500 truncate">
                        {suggestion.description}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {suggestion.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {hasRecentSearches && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Recent Searches
                </h4>
                {onHistoryClear && (
                  <button
                    onClick={onHistoryClear}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <div className="py-1">
              {history.slice(0, maxHistoryItems).map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleHistorySelect(item)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
                >
                  <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {item.query}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle re-search with this query
                      setLocalValue(item.query);
                      onChange(item.query);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search History (when input is empty) */}
        {hasHistory && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Search History
                </h4>
                {onHistoryClear && (
                  <button
                    onClick={onHistoryClear}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <div className="py-1">
              {history.slice(0, maxHistoryItems).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleHistorySelect(item)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
                >
                  <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {item.query}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filters */}
        {filters.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Quick filters:</span>
              <div className="flex gap-2">
                {filters.slice(0, 3).map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id, !activeFilters[filter.id])}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                      activeFilters[filter.id]
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
                {filters.length > 3 && (
                  <button
                    onClick={() => setShowFiltersPanel(true)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    +{filters.length - 3} more
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`flex items-center rounded-lg transition-all duration-200 ${
          sizeClasses[size]
        } ${variantClasses[variant]} ${
          isFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}
      >
        {/* Search Icon */}
        <div className="pl-3 pr-2 text-gray-400">
          {loading ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <MagnifyingGlassIcon className="w-5 h-5" />
          )}
        </div>

        {/* Search Types */}
        {renderSearchTypes()}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 ${
            disabled ? 'cursor-not-allowed opacity-50' : ''
          } ${inputClassName}`}
          aria-label="Search"
        />

        {/* Loading/Debouncing Indicator */}
        {(loading || isDebouncing) && (
          <div className="px-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Clear Button */}
        {showClearButton && localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}

        {/* Filters Button */}
        {renderFilters()}

        {/* Search Button */}
        {showSearchButton && (
          <button
            type="button"
            onClick={handleSearch}
            disabled={disabled || !localValue.trim()}
            className={`px-4 h-full rounded-r-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${buttonClassName}`}
            aria-label="Search"
          >
            <span className="hidden sm:inline">Search</span>
            <MagnifyingGlassIcon className="w-5 h-5 sm:hidden" />
          </button>
        )}
      </div>

      {/* Active Filters Badge */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            const filter = filters.find(f => f.id === key);
            if (!filter) return null;

            let displayValue = value;
            if (Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (filter.type === 'select' && filter.options) {
              const option = filter.options.find(opt => opt.value === value);
              displayValue = option?.label || value;
            }

            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                <span className="font-medium">{filter.label}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() => handleFilterChange(key, null)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            );
          })}
          {activeFiltersCount > 1 && (
            <button
              onClick={() => {
                setActiveFilters({});
                if (onFilterChange) onFilterChange({});
              }}
              className="text-xs text-gray-600 hover:text-gray-900"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Dropdown */}
      {renderDropdownContent()}

      {/* Advanced Search Toggle */}
      {showFilters && filters.length > 0 && (
        <button
          type="button"
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          className="absolute -bottom-8 left-0 text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <AdjustmentsHorizontalIcon className="w-3 h-3" />
          Advanced Search
          <ChevronDownIcon className={`w-3 h-3 transition-transform ${
            showFiltersPanel ? 'rotate-180' : ''
          }`} />
        </button>
      )}
    </div>
  );
};

// Pre-styled search bar variants
export const CompactSearchBar: React.FC<Omit<SearchBarProps, 'size' | 'variant' | 'showSearchButton'>> = (props) => (
  <SearchBar
    {...props}
    size="sm"
    variant="outline"
    showSearchButton={false}
    showClearButton={true}
    showSuggestions={false}
    showHistory={false}
  />
);

export const FilledSearchBar: React.FC<Omit<SearchBarProps, 'variant'>> = (props) => (
  <SearchBar
    {...props}
    variant="filled"
    showSearchButton={true}
    showClearButton={true}
  />
);

export const MinimalSearchBar: React.FC<Omit<SearchBarProps, 'variant' | 'showSearchButton' | 'showClearButton'>> = (props) => (
  <SearchBar
    {...props}
    variant="minimal"
    showSearchButton={false}
    showClearButton={false}
    showSuggestions={false}
    showHistory={false}
  />
);

export const AdvancedSearchBar: React.FC<SearchBarProps> = (props) => (
  <SearchBar
    {...props}
    showFilters={true}
    showSuggestions={true}
    showHistory={true}
    debounceTime={500}
    maxSuggestions={8}
    maxHistoryItems={10}
  />
);

// Hook for search state management
export const useSearch = (initialQuery = '', initialFilters = {}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const handleSearch = useCallback(async (searchQuery: string, searchFilters?: Record<string, any>) => {
    setIsSearching(true);
    
    // Save to history
    const historyItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query: searchQuery,
      timestamp: new Date(),
      filters: searchFilters
    };
    
    setSearchHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 items
    
    try {
      // Simulate API call
      // In real app, this would be your search API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock results
      const results = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        name: `Result ${i + 1} for "${searchQuery}"`,
        description: `This is result ${i + 1}`
      }));
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    isSearching,
    searchResults,
    searchHistory,
    handleSearch,
    clearHistory
  };
};

export default SearchBar;