import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Vote } from 'lucide-react';
import type { Eleicao } from '../../domain/eleicao';
import { MockApiService } from '../../data/api/MockApiService';
import { Layout, GovButton, Loading, StatusBadge, Card, SubHeader, EmptyState, SectionHeader } from '../components';
import { ElectionTimer } from '../components/voting';
import { formatarDataHoraLegivel } from '../../utils/dateUtils';

export const EleicoesPage: React.FC = () => {
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
                                                    {formatarDataHoraLegivel(eleicao.dataInicio)} - {formatarDataHoraLegivel(eleicao.dataFim)}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <StatusBadge status={eleicao.status as 'ativa' | 'futura' | 'encerrada'} />
                                        <ElectionTimer
                                            dataInicio={eleicao.dataInicio}
                                            dataFim={eleicao.dataFim}
                                            status={eleicao.status}
                                        />
                                    </div>
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
