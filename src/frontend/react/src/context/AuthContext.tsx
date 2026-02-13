import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState, User, LoginRequest, LoginResponse } from '@/types';
import { authApi } from '@/api';

interface AuthContextType extends AuthState {
  login: (data: LoginRequest, role?: 'client' | 'employee') => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const userJson = localStorage.getItem(USER_KEY);
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson) as User;
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // Invalid user data, clear storage
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest, role: 'client' | 'employee' = 'client'): Promise<void> => {
    try {
      const response: LoginResponse = await authApi.login(data, role);
      
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      
      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState((prev) => ({
      ...prev,
      user,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
