import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, FileText, Calendar, Users } from 'lucide-react';
import { MockApiService } from '../../data/api/MockApiService';
import { useAuth } from '../../contexts/AuthContext'
import type { Voto } from '../../domain/voto';
import { Layout, Loading, EmptyState, Card, SubHeader } from '../components';
import { formatarDataBrasileira } from '../../utils/dateUtils';

interface VotosPorEleicao {
    [eleicaoId: string]: {
        eleicaoNome: string;
        votos: Voto[];
        dataVotacao: Date;
    };
}

export const MeusVotosPage: React.FC = () => {
    const [votos, setVotos] = useState<Voto[]>([]);
    const [loading, setLoading] = useState(true);
    const [eleicoesVisiveis, setEleicoesVisiveis] = useState<Set<string>>(new Set());
    const { usuario } = useAuth();
    const api = new MockApiService();

    useEffect(() => {
        if (usuario) {
            api.buscarMeusVotos(usuario.cpf).then(data => {
                setVotos(data);
                setLoading(false);
            });
        }
    }, [usuario]);

    // Agrupar votos por eleição
    const votosPorEleicao: VotosPorEleicao = votos.reduce((acc, voto) => {
        if (!acc[voto.eleicaoId]) {
            acc[voto.eleicaoId] = {
                eleicaoNome: voto.eleicaoNome,
                votos: [],
                dataVotacao: voto.timestamp
            };
        }
        acc[voto.eleicaoId].votos.push(voto);
        return acc;
    }, {} as VotosPorEleicao);

    const toggleEleicaoVisivel = (eleicaoId: string) => {
        setEleicoesVisiveis(prev => {
            const novo = new Set(prev);
            if (novo.has(eleicaoId)) {
                novo.delete(eleicaoId);
            } else {
                novo.add(eleicaoId);
            }
            return novo;
        });
    };

    return (
        <Layout
            showBackButton={true}
            backPath="/eleicoes"
            backLabel="Voltar às eleições"
            className="bg-[#F8F9FA]"
        >
            <SubHeader />
            <div className="max-w-7xl mx-auto px-4 py-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Histórico de Votação</h1>

                {loading ? (
                    <Loading text="Carregando seus votos..." />
                ) : votos.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="Nenhum voto registrado"
                        description="Você ainda não tem votos registrados"
                    />
                ) : (
                    <div className="space-y-6">
                        {Object.entries(votosPorEleicao).map(([eleicaoId, dadosEleicao]) => (
                            <Card key={eleicaoId} className="overflow-hidden">
                                {/* Cabeçalho da Eleição */}
                                <div className="bg-white border-b border-gray-200 p-6 -m-6 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800 mb-2">{dadosEleicao.eleicaoNome}</h2>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    {formatarDataBrasileira(dadosEleicao.dataVotacao)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={16} />
                                                    {dadosEleicao.votos.length} voto{dadosEleicao.votos.length > 1 ? 's' : ''} registrado{dadosEleicao.votos.length > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle size={20} />
                                                <span className="text-sm font-medium">Concluída</span>
                                            </div>
                                            <button
                                                onClick={() => toggleEleicaoVisivel(eleicaoId)}
                                                className="bg-[#1351B4] hover:bg-[#0c3d8a] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                                title={eleicoesVisiveis.has(eleicaoId) ? "Ocultar detalhes dos votos" : "Ver detalhes dos votos"}
                                            >
                                                {eleicoesVisiveis.has(eleicaoId) ? <EyeOff size={16} /> : <Eye size={16} />}
                                                {eleicoesVisiveis.has(eleicaoId) ? 'Ocultar' : 'Ver'} Votos
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de Votos */}
                                <div className="space-y-4">
                                    {dadosEleicao.votos.map((voto, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800">{voto.categoriaNome}</h3>
                                                    <div className={`mt-1 transition-all duration-300 ${eleicoesVisiveis.has(eleicaoId) ? 'blur-none' : 'blur-sm'}`}>
                                                        <p className="text-sm text-gray-600">
                                                            Nº {voto.candidatoNumero} - {voto.candidatoNome}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {eleicoesVisiveis.has(eleicaoId) && (
                                                <div className="bg-white border border-gray-200 rounded p-3 mt-3">
                                                    <p className="text-xs text-gray-600 mb-2 font-medium">Hash Blockchain:</p>
                                                    <p className="font-mono text-xs text-gray-800 break-all bg-gray-100 p-2 rounded">
                                                        {voto.hashBlockchain}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};