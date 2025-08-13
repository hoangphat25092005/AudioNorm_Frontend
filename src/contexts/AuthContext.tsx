import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getUserProfile, UserData } from '../services/api';
import { isAuthenticated, removeToken } from '../services/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserData | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const checkAuth = async () => {
    if (isAuthenticated()) {
      try {
        const userData = await getUserProfile();
        setUser(userData);
        return true;
      } catch (error) {
        console.error('Authentication check failed:', error);
        removeToken();
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      return false;
    }
  };
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const login = (token: string) => {
    checkAuth();
  };
  
  const logout = () => {
    removeToken();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn: !!user, 
        user, 
        login, 
        logout,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);