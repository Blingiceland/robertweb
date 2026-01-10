'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import LoginForm from './LoginForm';

interface AuthContextType {
    isAuthenticated: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const res = await fetch('/api/auth');
            const data = await res.json();
            setIsAuthenticated(data.authenticated);
        } catch {
            setIsAuthenticated(false);
        }
    }

    async function logout() {
        await fetch('/api/auth', { method: 'DELETE' });
        setIsAuthenticated(false);
    }

    // Loading state
    if (isAuthenticated === null) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            }}>
                <div style={{ color: 'white', fontSize: '18px' }}>Hleð...</div>
            </div>
        );
    }

    // Not authenticated - show login
    if (!isAuthenticated) {
        return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;
    }

    // Authenticated - show admin content
    return (
        <AuthContext.Provider value={{ isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
