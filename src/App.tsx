import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HomePage } from '../src/presentation/pages/home'
import { LoginPage } from '../src/presentation/pages/login'
import { VotacaoPage } from '../src/presentation/pages/votacao'
import { EleicoesPage } from '../src/presentation/pages/eleicoes'
import { MeusVotosPage } from '../src/presentation/pages/meus-votos'

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/eleicoes"
                    element={
                        <ProtectedRoute>
                            <EleicoesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/votar/:eleicaoId"
                    element={
                        <ProtectedRoute>
                            <VotacaoPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/meus-votos"
                    element={
                        <ProtectedRoute>
                            <MeusVotosPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;