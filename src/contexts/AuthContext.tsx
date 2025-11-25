import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  role: 'enfermera' | 'medico';
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role') as 'enfermera' | 'medico' | null;

    if (token && email && role) {
      setUser({ email, role, token });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
      // 
      // const data = await response.json();
      // const { token, role } = data;

      // Mock response for development
      const mockToken = 'mock-jwt-token-' + Date.now();
      const mockRole = email.includes('enfermera') ? 'enfermera' : 'medico';

      const userData: User = {
        email,
        role: mockRole,
        token: mockToken,
      };

      // Store in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('role', userData.role);

      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
