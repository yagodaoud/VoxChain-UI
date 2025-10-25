import React, { useState, createContext, useContext, useEffect } from 'react';
import { MockApiService } from './data/api/MockApiService';
import type { Usuario } from './domain/usuario';
import { AuthContext, type AuthContextType } from './contexts/AuthContext'
import { HomePage } from '../src/presentation/pages/home'
import { LoginPage } from '../src/presentation/pages/login'
import { VotacaoPage } from '../src/presentation/pages/votacao'
import { DashboardPage } from '../src/presentation/pages/dashboard'
import { MeusVotosPage } from '../src/presentation/pages/meus-votos'

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [eleicaoSelecionada, setEleicaoSelecionada] = useState<string>('');
    const api = new MockApiService();

    const handleNavigate = (page: string, eleicaoId?: string) => {
        setCurrentPage(page);
        if (eleicaoId) setEleicaoSelecionada(eleicaoId);
    };

    const handleLogin = async (cpf: string, senha: string) => {
        const user = await api.autenticar(cpf, senha);
        setUsuario(user);
    };

    const handleLogout = () => {
        setUsuario(null);
        setCurrentPage('home');
    };

    const authValue: AuthContextType = {
        usuario,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: !!usuario
    };

    return (
        <AuthContext.Provider value={authValue} >
            {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />
            }
            {currentPage === 'login' && <HomePage onNavigate={handleNavigate} />}
            {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
            {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
            {currentPage === 'votar' && <VotacaoPage eleicaoId={eleicaoSelecionada} onNavigate={handleNavigate} />}
            {currentPage === 'meus-votos' && <MeusVotosPage onNavigate={handleNavigate} />}
        </AuthContext.Provider>
    );
}

export default App;