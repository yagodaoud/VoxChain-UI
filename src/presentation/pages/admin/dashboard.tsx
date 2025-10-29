import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Users, Vote, Shield } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Layout, Card, GovButton } from '../../components';
import { AdminSubHeader } from '../../components/layout';

export const AdminDashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const menuItems = [
        {
            title: 'Gerenciar Eleições',
            description: 'Visualizar e criar novas eleições',
            icon: Vote,
            path: '/admin/eleicoes',
            color: 'bg-[#1351B4]'
        },
        {
            title: 'Gerenciar Candidatos',
            description: 'Visualizar e criar candidatos',
            icon: Users,
            path: '/admin/candidatos',
            color: 'bg-[#071D41]'
        },
        {
            title: 'Configurações',
            description: 'Configurações do sistema',
            icon: Settings,
            path: '/admin/configuracoes',
            color: 'bg-gray-600',
            disabled: true
        }
    ];

    return (
        <Layout className="bg-[#F8F9FA]">

            {/* Admin Sub Header */}
            <AdminSubHeader />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-[#1351B4]" size={32} />
                        <h1 className="text-4xl font-bold text-gray-800">Painel Administrativo</h1>
                    </div>
                    <p className="text-gray-600">
                        Bem-vindo, <span className="font-semibold">{usuario?.nome}</span>
                        {usuario?.tipo === 'super-admin' && (
                            <span className="ml-2 px-2 py-1 bg-[#1351B4] text-white text-xs rounded">
                                Super Admin
                            </span>
                        )}
                    </p>
                </div>


                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card padding="lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#1351B4] rounded-lg flex items-center justify-center">
                                <Vote className="text-white" size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800">0</div>
                                <div className="text-sm text-gray-600">Eleições Ativas</div>
                            </div>
                        </div>
                    </Card>

                    <Card padding="lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#071D41] rounded-lg flex items-center justify-center">
                                <Users className="text-white" size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800">0</div>
                                <div className="text-sm text-gray-600">Candidatos Cadastrados</div>
                            </div>
                        </div>
                    </Card>

                    <Card padding="lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                <Shield className="text-white" size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800">0</div>
                                <div className="text-sm text-gray-600">Total de Votos</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Menu Items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Card key={index} hover={!item.disabled} padding="lg">
                                <div className="flex flex-col h-full">
                                    <div className={`w-16 h-16 ${item.color} rounded-lg flex items-center justify-center mb-4`}>
                                        <Icon className="text-white" size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 flex-grow">
                                        {item.description}
                                    </p>
                                    <GovButton
                                        onClick={() => !item.disabled && navigate(item.path)}
                                        variant={item.disabled ? 'secondary' : 'primary'}
                                        disabled={item.disabled}
                                        fullWidth
                                    >
                                        {item.disabled ? 'Em breve' : 'Acessar'}
                                    </GovButton>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <Card className="mt-8" padding="lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
                    <div className="flex flex-wrap gap-3">
                        <GovButton onClick={() => navigate('/admin/eleicoes/criar')}>
                            Criar Nova Eleição
                        </GovButton>
                        <GovButton onClick={() => navigate('/admin/candidatos/criar')} variant="secondary">
                            Adicionar Candidato
                        </GovButton>
                        <GovButton onClick={() => navigate('/eleicoes')} variant="secondary">
                            Ver Como Eleitor
                        </GovButton>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

