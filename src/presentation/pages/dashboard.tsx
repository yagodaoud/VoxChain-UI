import React, { useState, createContext, useContext, useEffect } from 'react';
import { Search, User, ChevronRight, Eye, EyeOff, Calendar, CheckCircle, Clock, FileText } from 'lucide-react';
import type { Eleicao } from '../../domain/eleicao';
import { MockApiService } from '../../data/api/MockApiService';
import { useAuth } from '../../contexts/AuthContext'
import { GovButton } from '../components/govButton';

export const DashboardPage: React.FC<{ onNavigate: (page: string, eleicaoId?: string) => void }> = ({ onNavigate }) => {
    const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
    const [loading, setLoading] = useState(true);
    const { usuario, logout } = useAuth();
    const api = new MockApiService();

    useEffect(() => {
        api.buscarEleicoes().then(data => {
            setEleicoes(data);
            setLoading(false);
        });
    }, []);

    const getStatusBadge = (status: string) => {
        const styles = {
            ativa: 'bg-green-100 text-green-800 border-green-200',
            futura: 'bg-blue-100 text-blue-800 border-blue-200',
            encerrada: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        const labels = {
            ativa: 'Em andamento',
            futura: 'Em breve',
            encerrada: 'Encerrada'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            {/* Header */}
            <header className="bg-[#071D41] text-white">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1351B4] rounded flex items-center justify-center font-bold text-xl">
                            V
                        </div>
                        <div>
                            <div className="font-bold text-lg">VoxChain</div>
                            <div className="text-xs text-gray-300">{usuario?.nome}</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => onNavigate('meus-votos')}
                            className="px-4 py-2 bg-[#1351B4] rounded hover:bg-[#0c3d8a] transition text-sm"
                        >
                            Meus Votos
                        </button>
                        <button
                            onClick={() => { logout(); onNavigate('home'); }}
                            className="px-4 py-2 bg-white text-[#071D41] rounded hover:bg-gray-100 transition text-sm"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <div className="bg-[#1351B4] h-2"></div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Eleições Disponíveis</h1>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1351B4] mx-auto"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {eleicoes.map(eleicao => (
                            <div key={eleicao.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">{eleicao.nome}</h2>
                                        <p className="text-gray-600 text-sm mb-3">{eleicao.descricao}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={16} />
                                                {eleicao.dataInicio.toLocaleDateString()} - {eleicao.dataFim.toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    {getStatusBadge(eleicao.status)}
                                </div>

                                {eleicao.status === 'ativa' && (
                                    <GovButton onClick={() => onNavigate('votar', eleicao.id)}>
                                        Votar Agora
                                        <ChevronRight size={18} />
                                    </GovButton>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};