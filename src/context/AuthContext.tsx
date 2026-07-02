import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import { login, register } from '../data/users';
import { storage, isTodayCheckedIn } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => boolean;
  register: (data: RegisterRequest) => boolean;
  logout: () => void;
  updateUser: (user: User) => void;
  checkIn: () => boolean;
  hasCheckedInToday: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  useEffect(() => {
    const storedUser = storage.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setHasCheckedInToday(isTodayCheckedIn());
  }, []);

  const handleLogin = (credentials: LoginRequest): boolean => {
    const result = login(credentials);
    if (result) {
      storage.setToken(result.token);
      storage.setUser(result.user);
      setUser(result.user);
      return true;
    }
    return false;
  };

  const handleRegister = (data: RegisterRequest): boolean => {
    const result = register(data);
    if (result) {
      storage.setToken(result.token);
      storage.setUser(result.user);
      setUser(result.user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    storage.removeToken();
    storage.removeUser();
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    storage.setUser(updatedUser);
    setUser(updatedUser);
  };

  const handleCheckIn = (): boolean => {
    if (hasCheckedInToday) return false;
    
    if (user) {
      const updatedUser = {
        ...user,
        streakDays: user.streakDays + 1,
      };
      handleUpdateUser(updatedUser);
    }
    
    storage.setDailyCheckin(new Date().toISOString().split('T')[0]);
    setHasCheckedInToday(true);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateUser: handleUpdateUser,
        checkIn: handleCheckIn,
        hasCheckedInToday,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
