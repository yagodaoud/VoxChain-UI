import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { Layout, GovButton, Input, FormCard, ErrorModal } from '../components';
import { useAuth } from '../../contexts/AuthContext';
import { formatCPF } from '../../utils/cpfUtils';
import { getErrorMessage } from '../../utils/errorUtils';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { login, isAuthenticated } = useAuth();

    // Redireciona se já estiver logado
    useEffect(() => {
        if (isAuthenticated) {
            const user = JSON.parse(localStorage.getItem('usuario') || '{}');
            if (user.tipo === 'admin' || user.tipo === 'super-admin') {
                navigate('/admin');
            } else {
                navigate('/eleicoes');
            }
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(cpf, senha);
            const user = JSON.parse(localStorage.getItem('usuario') || '{}');

            if (user.tipo === 'admin' || user.tipo === 'super-admin') {
                navigate('/admin');
            } else {
                navigate('/eleicoes');
            }
        } catch (error) {
            const errorMsg = getErrorMessage(error, 'Erro ao fazer login');
            setErrorMessage(errorMsg);
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Layout
            showBackButton={true}
            backPath="/"
            backLabel="Voltar para home"
            className="bg-[#F8F9FA]"
        >
            {/* Login Form */}
            <div className="max-w-md mx-auto px-4 py-16">
                <FormCard
                    title="Entrar na VoxChain"
                    subtitle="Use seu CPF e senha para acessar"
                    icon={User}
                >
                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input
                            label="CPF"
                            value={cpf}
                            onChange={(value) => setCpf(formatCPF(value, cpf))}
                            placeholder="000.000.000-00"
                            required
                        />

                        <Input
                            label="Senha"
                            type="password"
                            value={senha}
                            onChange={setSenha}
                            placeholder="Digite sua senha"
                            required
                        />

                        <GovButton type="submit" fullWidth disabled={loading}>
                            {loading ? 'Autenticando...' : 'Entrar'}
                        </GovButton>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            🔒 Conexão segura • Seus dados são protegidos por criptografia
                        </p>
                    </div>
                </FormCard>
            </div>

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Erro ao fazer login"
                message={errorMessage}
            />
        </Layout>
    );
};