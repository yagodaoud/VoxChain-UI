import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Vote } from 'lucide-react';
import type { Eleicao } from '../../domain/eleicao';
import { ApiService } from '../../data/api/ApiService';
import { Layout, GovButton, Loading, StatusBadge, Card, SubHeader, EmptyState, SectionHeader } from '../components';
import { ElectionTimer } from '../components/voting';
import { formatarDataHoraLegivel } from '../../utils/dateUtils';

export const EleicoesPage: React.FC = () => {
    const navigate = useNavigate();
    const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
    const [loading, setLoading] = useState(true);
    const api = new ApiService();

    useEffect(() => {
        api.buscarEleicoes().then(data => {
            setEleicoes(data);
            setLoading(false);
        });
    }, []);


    return (
        <Layout className="bg-[#F8F9FA]">
            <SubHeader />
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <SectionHeader
                    icon={Vote}
                    title="Eleições Disponíveis"
                    subtitle="Veja as eleições disponíveis para votar"
                />

                {loading ? (
                    <Loading text="Carregando eleições..." />
                ) : eleicoes.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="Nenhuma eleição disponível"
                        description="Não há eleições ativas ou futuras no momento."
                        className="bg-gray-50 py-24"
                    />
                ) : (
                    <div className="grid gap-6">
                        {eleicoes.map(eleicao => (
                            <Card key={eleicao.id} hover>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">{eleicao.nome}</h2>
                                        <p className="text-gray-600 text-sm mb-3">{eleicao.descricao}</p>
                                        <div className="flex items-center gap-4 text-base text-gray-500">
                                            <span className="flex items-center gap-2">
                                                <Calendar size={18} />
                                                <span className="font-semibold">
                                                    {formatarDataHoraLegivel(eleicao.dataInicioDate)} - {formatarDataHoraLegivel(eleicao.dataFimDate)}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <StatusBadge status={eleicao.status as 'ativa' | 'futura' | 'encerrada'} />
                                        <ElectionTimer
                                            dataInicio={eleicao.dataInicioDate}
                                            dataFim={eleicao.dataFimDate}
                                            status={eleicao.status as 'ativa' | 'futura' | 'encerrada'}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    {eleicao.status === 'ativa' && (
                                        <GovButton onClick={() => navigate(`/votar/${eleicao.id}`)}>
                                            Votar Agora
                                            <ChevronRight size={18} />
                                        </GovButton>
                                    )}

                                    {(eleicao.status === 'ativa' || eleicao.status === 'encerrada') && (
                                        <button
                                            onClick={() => navigate(`/resultados/${eleicao.id}`)}
                                            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${eleicao.status === 'ativa'
                                                    ? 'bg-white text-[#1351B4] border border-[#1351B4] hover:bg-blue-50'
                                                    : 'bg-[#1351B4] text-white hover:bg-blue-800 shadow-lg hover:shadow-xl'
                                                }`}
                                        >
                                            {eleicao.status === 'ativa' ? 'Acompanhar Parcial' : 'Ver Resultados'}
                                            <ChevronRight size={18} />
                                        </button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};
