import { useState, useEffect } from 'react';

// ==========================================
// AUTENTICAÇÃO ADMIN - Hook
// ==========================================
// 
// Sistema de autenticação simples para o painel admin
// Senha hardcoded: "khaledaoferoz"
// Sessão armazenada no localStorage
// 

const ADMIN_PASSWORD = 'khaledaoferoz';
const AUTH_KEY = 'traldis_admin_auth';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas

interface AuthSession {
  authenticated: boolean;
  timestamp: number;
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sessão existente ao carregar
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY);
      
      if (storedAuth) {
        const session: AuthSession = JSON.parse(storedAuth);
        const now = Date.now();
        
        // Verificar se a sessão ainda é válida (24h)
        if (session.authenticated && (now - session.timestamp) < SESSION_DURATION) {
          setIsAuthenticated(true);
        } else {
          // Sessão expirada
          logout();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const session: AuthSession = {
        authenticated: true,
        timestamp: Date.now()
      };
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}
