import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar } from 'lucide-react';
import type { Eleicao } from '../../domain/eleicao';
import { MockApiService } from '../../data/api/MockApiService';
import { Layout, GovButton, Loading, StatusBadge, Card } from '../components';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
    const [loading, setLoading] = useState(true);
    const api = new MockApiService();

    useEffect(() => {
        api.buscarEleicoes().then(data => {
            setEleicoes(data);
            setLoading(false);
        });
    }, []);


    return (
        <Layout className="bg-[#F8F9FA]">
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Eleições Disponíveis</h1>

                {loading ? (
                    <Loading text="Carregando eleições..." />
                ) : (
                    <div className="grid gap-6">
                        {eleicoes.map(eleicao => (
                            <Card key={eleicao.id} hover>
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
                                    <StatusBadge status={eleicao.status as 'ativa' | 'futura' | 'encerrada'} />
                                </div>

                                {eleicao.status === 'ativa' && (
                                    <GovButton onClick={() => navigate(`/votar/${eleicao.id}`)}>
                                        Votar Agora
                                        <ChevronRight size={18} />
                                    </GovButton>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};