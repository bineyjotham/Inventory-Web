import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Alex Johnson',
    email: 'admin@inventory.com',
    role: 'admin',
    avatar: 'AJ'
  },
  manager: {
    id: '2',
    name: 'Sarah Miller',
    email: 'manager@inventory.com',
    role: 'manager',
    avatar: 'SM'
  },
  staff: {
    id: '3',
    name: 'Mike Wilson',
    email: 'staff@inventory.com',
    role: 'staff',
    avatar: 'MW'
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for persisted login
    const savedUser = localStorage.getItem('inventory_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = (email: string, password: string, role: UserRole): boolean => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Demo validation
      if (email && password) {
        const newUser = mockUsers[role] || {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          role,
          avatar: email.charAt(0).toUpperCase()
        };
        
        setUser(newUser);
        localStorage.setItem('inventory_user', JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    }, 500);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventory_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};