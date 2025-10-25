import React, { useState, createContext, useContext, useEffect } from 'react';
import { Search, User, ChevronRight, Eye, EyeOff, Calendar, CheckCircle, Clock, FileText } from 'lucide-react';
import { GovButton } from '../components/govButton';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(cpf, senha);
            onNavigate('dashboard');
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
        <div className="min-h-screen bg-[#F8F9FA]">
            {/* Header */}
            <header className="bg-[#071D41] text-white py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <button onClick={() => onNavigate('home')} className="flex items-center gap-3 hover:opacity-80 transition">
                        <div className="w-10 h-10 bg-[#1351B4] rounded flex items-center justify-center font-bold text-xl">
                            V
                        </div>
                        <div>
                            <div className="font-bold text-lg">VoxChain</div>
                            <div className="text-xs text-gray-300">Voltar para home</div>
                        </div>
                    </button>
                </div>
            </header>

            <div className="bg-[#1351B4] h-2"></div>

            {/* Login Form */}
            <div className="max-w-md mx-auto px-4 py-16">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-[#1351B4] rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="text-white" size={40} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Entrar no VoxChain</h1>
                        <p className="text-gray-600 text-sm">Use seu CPF e senha para acessar</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CPF
                            </label>
                            <input
                                type="text"
                                value={cpf}
                                onChange={(e) => setCpf(formatCPF(e.target.value))}
                                placeholder="000.000.000-00"
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1351B4] focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Digite sua senha"
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1351B4] focus:border-transparent outline-none"
                                required
                            />
                        </div>

                        <GovButton fullWidth>
                            {loading ? 'Autenticando...' : 'Entrar'}
                        </GovButton>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            🔒 Conexão segura • Seus dados são protegidos por criptografia
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};