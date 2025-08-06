import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      const savedUser = localStorage.getItem('studyEditUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = async (email, password) => {
    // Mock login - in real app, this would call API
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'alex@example.com' && password === 'password') {
      setUser(mockUser);
      localStorage.setItem('studyEditUser', JSON.stringify(mockUser));
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = async (name, email, password, grade) => {
    // Mock signup
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      ...mockUser,
      name,
      email,
      grade: parseInt(grade)
    };
    
    setUser(newUser);
    localStorage.setItem('studyEditUser', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studyEditUser');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};