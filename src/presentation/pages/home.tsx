import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, CheckCircle, FileText } from 'lucide-react';
import { Layout, GovButton, Card } from '../components';
import { useAuth } from '../../contexts/AuthContext';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Redireciona usuários logados para as eleições
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/eleicoes');
        }
    }, [isAuthenticated, navigate]);
    return (
        <Layout showUserActions={true}>

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
                        <Card hover>
                            <div className="w-14 h-14 bg-[#E6F1FF] rounded-full flex items-center justify-center mb-4">
                                <User className="text-[#1351B4]" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">1. Faça Login</h3>
                            <p className="text-gray-600">
                                Acesse com seu CPF de forma segura usando autenticação gov.br
                            </p>
                        </Card>

                        <Card hover>
                            <div className="w-14 h-14 bg-[#E6F1FF] rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="text-[#1351B4]" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">2. Gere Token Anônimo</h3>
                            <p className="text-gray-600">
                                Antes de votar, um token anônimo é gerado para garantir o sigilo completo do seu voto
                            </p>
                        </Card>

                        <Card hover>
                            <div className="w-14 h-14 bg-[#E6F1FF] rounded-full flex items-center justify-center mb-4">
                                <FileText className="text-[#1351B4]" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">3. Vote com Segurança</h3>
                            <p className="text-gray-600">
                                Escolha seus candidatos com interface similar à urna eletrônica. Seu voto é registrado de forma anônima e imutável na blockchain
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

        </Layout>
    );
};