import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HomePage } from '../src/presentation/pages/home'
import { LoginPage } from '../src/presentation/pages/login'
import { VotacaoPage } from '../src/presentation/pages/votacao'
import { EleicoesPage } from '../src/presentation/pages/eleicoes'
import { MeusVotosPage } from '../src/presentation/pages/meus-votos'
import { AdminDashboardPage } from '../src/presentation/pages/admin/dashboard'
import { AdminEleicoesPage } from '../src/presentation/pages/admin/eleicoes'
import { CriarEleicaoPage } from '../src/presentation/pages/admin/eleicoes/criar'
import { AdminCandidatosPage } from '../src/presentation/pages/admin/candidatos'
import { CriarCandidatoPage } from '../src/presentation/pages/admin/candidatos/criar'
import { AdminEleitoresPage } from '../src/presentation/pages/admin/eleitores'
import { CriarEleitorPage } from '../src/presentation/pages/admin/eleitores/criar'

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para rotas de admin
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, usuario } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (usuario?.tipo !== 'admin' && usuario?.tipo !== 'super-admin') {
        return <Navigate to="/eleicoes" replace />;
    }

    return <>{children}</>;
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
                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboardPage />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/eleicoes"
                    element={
                        <AdminProtectedRoute>
                            <AdminEleicoesPage />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/eleicoes/criar"
                    element={
                        <AdminProtectedRoute>
                            <CriarEleicaoPage />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/eleicoes/editar/:id"
                    element={
                        <AdminProtectedRoute>
                            <CriarEleicaoPage />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/candidatos"
                    element={
                        <AdminProtectedRoute>
                            <AdminCandidatosPage />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/candidatos/criar"
                    element={
                        <AdminProtectedRoute>
                            <CriarCandidatoPage />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/eleitores"
                    element={
                        <AdminProtectedRoute>
                            <AdminEleitoresPage />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/eleitores/criar"
                    element={
                        <AdminProtectedRoute>
                            <CriarEleitorPage />
                        </AdminProtectedRoute>
                    }
                />
                <Route
                    path="/admin/eleitores/editar/:cpfHash"
                    element={
                        <AdminProtectedRoute>
                            <CriarEleitorPage />
                        </AdminProtectedRoute>
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