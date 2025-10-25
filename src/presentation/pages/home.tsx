import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, CheckCircle, FileText } from 'lucide-react';
import { GovButton } from '../components/govButton';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white">
            {/* Header Gov.br */}
            <header className="bg-[#071D41] text-white">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1351B4] rounded flex items-center justify-center font-bold text-xl">
                            V
                        </div>
                        <div>
                            <div className="font-bold text-lg">VoxChain</div>
                            <div className="text-xs text-gray-300">Sistema de Votação em Blockchain</div>
                        </div>
                    </div>
                    <GovButton onClick={() => navigate('/login')}>
                        <User size={18} />
                        Entrar com gov.br
                    </GovButton>
                </div>
            </header>

            {/* Barra azul */}
            <div className="bg-[#1351B4] h-2"></div>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#1351B4] to-[#155BCB] text-white py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-6">
                        Vote com Segurança e Transparência
                    </h1>
                    <p className="text-xl mb-8 text-gray-100 max-w-2xl">
                        Sistema de votação eletrônica baseado em blockchain. Seus votos são registrados de forma imutável,
                        auditável e completamente transparente.
                    </p>
                    <GovButton onClick={() => navigate('/login')} variant="secondary">
                        Acessar Minha Conta
                        <ChevronRight size={20} />
                    </GovButton>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[#1351B4] mb-12 text-center">
                        Como Funciona
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                            <div className="w-14 h-14 bg-[#E6F1FF] rounded-full flex items-center justify-center mb-4">
                                <User className="text-[#1351B4]" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">1. Faça Login</h3>
                            <p className="text-gray-600">
                                Acesse com seu CPF de forma segura usando autenticação gov.br
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                            <div className="w-14 h-14 bg-[#E6F1FF] rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="text-[#1351B4]" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">2. Vote</h3>
                            <p className="text-gray-600">
                                Escolha seus candidatos nas eleições ativas com interface similar à urna eletrônica
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                            <div className="w-14 h-14 bg-[#E6F1FF] rounded-full flex items-center justify-center mb-4">
                                <FileText className="text-[#1351B4]" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">3. Acompanhe</h3>
                            <p className="text-gray-600">
                                Visualize seu comprovante com hash blockchain e verifique a autenticidade
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#071D41] text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-300">
                        © 2025 VoxChain - Sistema de Votação em Blockchain | TCC
                    </p>
                </div>
            </footer>
        </div>
    );
};