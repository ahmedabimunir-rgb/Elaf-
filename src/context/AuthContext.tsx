import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { StoreService } from '../services/storeService';

interface AuthContextType {
  user: User;
  setRole: (role: UserRole) => void;
  login: (email: string, name?: string, role?: UserRole) => void;
  logout: () => void;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => StoreService.getCurrentUser());

  useEffect(() => {
    StoreService.setCurrentUser(user);
  }, [user]);

  const setRole = (role: UserRole) => {
    setUser((prev) => {
      let updatedName = prev.name;
      if (role === 'ADMIN') updatedName = 'Admin Manager';
      else if (role === 'STAFF') updatedName = 'Head Chef / Dispatcher';
      else updatedName = 'Ahmed Munir (Customer)';

      const updated = {
        ...prev,
        role,
        name: updatedName,
      };
      StoreService.setCurrentUser(updated);
      return updated;
    });
  };

  const login = (email: string, name: string = 'Elaf Customer', role: UserRole = 'CUSTOMER') => {
    const updated: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(updated);
    StoreService.setCurrentUser(updated);
  };

  const logout = () => {
    const guest: User = {
      id: `guest-${Date.now()}`,
      name: 'Guest Customer',
      email: 'guest@elafrestaurant.com',
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };
    setUser(guest);
    StoreService.setCurrentUser(guest);
  };

  const isAdmin = user.role === 'ADMIN';
  const isStaff = user.role === 'STAFF' || user.role === 'ADMIN';
  const isCustomer = user.role === 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        setRole,
        login,
        logout,
        isAdmin,
        isStaff,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
