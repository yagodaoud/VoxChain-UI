import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MockApiService } from './data/api/MockApiService';
import type { Usuario } from './domain/usuario';
import { AuthContext, type AuthContextType } from './contexts/AuthContext'
import { HomePage } from '../src/presentation/pages/home'
import { LoginPage } from '../src/presentation/pages/login'
import { VotacaoPage } from '../src/presentation/pages/votacao'
import { DashboardPage } from '../src/presentation/pages/dashboard'
import { MeusVotosPage } from '../src/presentation/pages/meus-votos'

function App() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const api = new MockApiService();

    const handleLogin = async (cpf: string, senha: string) => {
        const user = await api.autenticar(cpf, senha);
        setUsuario(user);
    };

    const handleLogout = () => {
        setUsuario(null);
    };

    const authValue: AuthContextType = {
        usuario,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: !!usuario
    };

    return (
        <AuthContext.Provider value={authValue}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route 
                        path="/dashboard" 
                        element={usuario ? <DashboardPage /> : <Navigate to="/login" replace />} 
                    />
                    <Route 
                        path="/votar/:eleicaoId" 
                        element={usuario ? <VotacaoPage /> : <Navigate to="/login" replace />} 
                    />
                    <Route 
                        path="/meus-votos" 
                        element={usuario ? <MeusVotosPage /> : <Navigate to="/login" replace />} 
                    />
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;