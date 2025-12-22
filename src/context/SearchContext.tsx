// src/context/SearchContext.tsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { SearchFilter, SearchHistoryItem } from '../components/common/SearchBar';

interface SearchState {
  query: string;
  filters: Record<string, any>;
  results: any[];
  history: SearchHistoryItem[];
  isLoading: boolean;
  searchType: string;
}

type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_FILTERS'; payload: Record<string, any> }
  | { type: 'SET_RESULTS'; payload: any[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_TYPE'; payload: string }
  | { type: 'ADD_TO_HISTORY'; payload: SearchHistoryItem }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'CLEAR_SEARCH' };

interface SearchContextType extends SearchState {
  search: (query: string, filters?: Record<string, any>) => Promise<void>;
  clearSearch: () => void;
  clearHistory: () => void;
  updateFilters: (filters: Record<string, any>) => void;
  setSearchType: (type: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SEARCH_TYPE':
      return { ...state, searchType: action.payload };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history.slice(0, 9)]
      };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    case 'CLEAR_SEARCH':
      return { ...state, query: '', results: [] };
    default:
      return state;
  }
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, {
    query: '',
    filters: {},
    results: [],
    history: [],
    isLoading: false,
    searchType: 'all'
  });

  const search = useCallback(async (query: string, filters?: Record<string, any>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_QUERY', payload: query });
    
    if (filters) {
      dispatch({ type: 'SET_FILTERS', payload: filters });
    }

    // Add to history
    dispatch({
      type: 'ADD_TO_HISTORY',
      payload: {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        filters
      }
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results
      const results = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        name: `Result ${i + 1} for "${query}"`,
        type: 'item',
        sku: `SKU-${i}`,
        category: 'Electronics',
        quantity: Math.floor(Math.random() * 100)
      }));
      
      dispatch({ type: 'SET_RESULTS', payload: results });
    } catch (error) {
      console.error('Search failed:', error);
      dispatch({ type: 'SET_RESULTS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const updateFilters = useCallback((filters: Record<string, any>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setSearchType = useCallback((type: string) => {
    dispatch({ type: 'SET_SEARCH_TYPE', payload: type });
  }, []);

  return (
    <SearchContext.Provider
      value={{
        ...state,
        search,
        clearSearch,
        clearHistory,
        updateFilters,
        setSearchType
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};