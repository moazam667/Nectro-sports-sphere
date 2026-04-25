'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'admin' | 'coach' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock user database
      const mockUsers: Record<string, { password: string; user: User }> = {
        'admin@sports.com': {
          password: 'admin123',
          user: { id: '1', email: 'admin@sports.com', name: 'Admin User', role: 'admin' },
        },
        'coach@sports.com': {
          password: 'coach123',
          user: { id: '2', email: 'coach@sports.com', name: 'Coach John', role: 'coach' },
        },
        'viewer@sports.com': {
          password: 'viewer123',
          user: { id: '3', email: 'viewer@sports.com', name: 'Viewer User', role: 'viewer' },
        },
      };

      const userRecord = mockUsers[email];
      if (!userRecord || userRecord.password !== password) {
        throw new Error('Invalid credentials');
      }

      setUser(userRecord.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
