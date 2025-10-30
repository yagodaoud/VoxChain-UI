import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Usuario } from '../domain/usuario';
import { ApiService } from '../data/api/ApiService';

export interface AuthContextType {
    usuario: Usuario | null;
    login: (cpf: string, senha: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const apiService = new ApiService();

    // Recupera usuário do localStorage ao montar
    useEffect(() => {
        const storedUsuario = localStorage.getItem('usuario');
        if (storedUsuario) {
            setUsuario(JSON.parse(storedUsuario));
        }
    }, []);

    const login = async (cpf: string, senha: string) => {
        try {
            const usuarioAutenticado = await apiService.autenticar(cpf, senha);
            setUsuario(usuarioAutenticado);
            localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('usuario');
    };

    const isAuthenticated = usuario !== null;

    return (
        <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
    return context;
};

