import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { Layout, GovButton, Input, FormCard } from '../components';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();

    // Redireciona se já estiver logado
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(cpf, senha);
            navigate('/dashboard');
        } catch (error) {
            alert('Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    const formatCPF = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        return cpf;
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
                    title="Entrar no VoxChain"
                    subtitle="Use seu CPF e senha para acessar"
                    icon={User}
                >
                    <form onSubmit={handleLogin} className="space-y-6">
                        <Input
                            label="CPF"
                            value={cpf}
                            onChange={(value) => setCpf(formatCPF(value))}
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

                        <GovButton fullWidth disabled={loading}>
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
        </Layout>
    );
};