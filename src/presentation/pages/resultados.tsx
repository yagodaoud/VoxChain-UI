import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Trophy, Users, AlertCircle, ArrowLeft } from 'lucide-react';
import { ApiService } from '../../data/api/ApiService';
import { Layout, Loading, EmptyState, Card, SubHeader, SectionHeader, StatusBadge } from '../components';
import type { ResultadoEleicao, ResultadoCargo } from '../../data/api/services/ElectionsService';
import { getErrorMessage } from '../../utils/errorUtils';

export const ResultadosPage: React.FC = () => {
    const { eleicaoId } = useParams<{ eleicaoId: string }>();
    const navigate = useNavigate();
    const [resultado, setResultado] = useState<ResultadoEleicao | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const api = new ApiService();

    useEffect(() => {
        if (eleicaoId) {
            loadResultados();
        }
    }, [eleicaoId]);

    const loadResultados = async () => {
        setLoading(true);
        try {
            // Primeiro buscamos a eleição para saber o status
            const eleicoes = await api.buscarEleicoes();
            const eleicao = eleicoes.find(e => e.id === eleicaoId);

            if (!eleicao) {
                throw new Error('Eleição não encontrada');
            }

            const parcial = eleicao.status === 'ativa';
            const dados = await api.buscarResultados(eleicaoId!, parcial);
            setResultado(dados);
        } catch (err) {
            console.error('Erro ao buscar resultados:', err);
            setError(getErrorMessage(err, 'Erro ao carregar resultados'));
        } finally {
            setLoading(false);
        }
    };

    const formatarPorcentagem = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor / 100);
    };

    const renderCargo = (cargo: string, dados: ResultadoCargo) => {
        // Ordenar candidatos por votos (decrescente)
        const candidatosOrdenados = [...(dados.candidatos || [])].sort((a, b) => b.votos - a.votos);
        const totalVotosValidos = dados.votosValidos;

        return (
            <Card key={cargo} padding="lg" className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{cargo}</h3>

                <div className="space-y-6">
                    {candidatosOrdenados.map((candidato, index) => {
                        const isWinner = index === 0 && resultado?.status === 'encerrada';
                        const porcentagem = totalVotosValidos > 0 ? (candidato.votos / totalVotosValidos) * 100 : 0;

                        return (
                            <div key={candidato.candidatoId} className="relative">
                                <div className="flex justify-between items-end mb-1">
                                    <div className="flex items-center gap-2">
                                        {isWinner && <Trophy size={16} className="text-yellow-500" />}
                                        <span className={`font-semibold ${isWinner ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {candidato.nome}
                                        </span>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                            {candidato.partido} - {candidato.numero}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-gray-900 block">
                                            {formatarPorcentagem(porcentagem)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {candidato.votos.toLocaleString('pt-BR')} votos
                                        </span>
                                    </div>
                                </div>

                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${isWinner ? 'bg-green-500' : 'bg-[#1351B4]'
                                            }`}
                                        style={{ width: `${porcentagem}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
                    <div>
                        <div className="font-semibold text-gray-800">{(dados.votosValidos || 0).toLocaleString('pt-BR')}</div>
                        <div>Votos Válidos</div>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800">{(dados.votosBrancos || 0).toLocaleString('pt-BR')}</div>
                        <div>Brancos</div>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800">{(dados.votosNulos || 0).toLocaleString('pt-BR')}</div>
                        <div>Nulos</div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <Layout className="bg-[#F8F9FA]">
            <SubHeader />
            <div className="max-w-7xl mx-auto px-4 py-4">
                <button
                    onClick={() => navigate('/eleicoes')}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#1351B4] mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Voltar para Eleições
                </button>

                <div className="flex items-center justify-between mb-6">
                    <SectionHeader
                        icon={BarChart}
                        title="Resultados da Eleição"
                        subtitle={resultado?.status === 'ativa' ? 'Acompanhamento em tempo real (Parcial)' : 'Resultado Final Oficial'}
                        className="mb-0"
                    />
                    {resultado && (
                        <StatusBadge status={resultado.status === 'ativa' ? 'ativa' : 'encerrada'} />
                    )}
                </div>

                {loading ? (
                    <Loading text="Carregando resultados..." />
                ) : error ? (
                    <EmptyState
                        icon={AlertCircle}
                        title="Erro ao carregar resultados"
                        description={error}
                        className="bg-red-50"
                    />
                ) : !resultado ? (
                    <EmptyState
                        icon={BarChart}
                        title="Resultados indisponíveis"
                        description="Não foi possível carregar os dados desta eleição."
                    />
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total de Votos Computados</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {(resultado.totalVotos || 0).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                            {resultado.status === 'ativa' && (
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Parcial
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">Atualizado em tempo real</p>
                                </div>
                            )}
                        </div>

                        {/* Renderização para estrutura antiga (por cargo) */}
                        {resultado.resultadosPorCargo && Object.entries(resultado.resultadosPorCargo).map(([cargo, dados]) =>
                            renderCargo(cargo, dados)
                        )}

                        {/* Renderização para estrutura nova (flat) */}
                        {resultado.candidatos && (
                            <Card padding="lg" className="mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                    {resultado.nomeEleicao || 'Resultado da Eleição'}
                                </h3>

                                {resultado.vencedor && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-4">
                                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                                            <Trophy size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-green-800 uppercase tracking-wide">Vencedor</p>
                                            <p className="text-lg font-bold text-gray-900">{resultado.vencedor.nome}</p>
                                            <p className="text-sm text-gray-600">{resultado.vencedor.partido} • {resultado.vencedor.numero}</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <p className="text-2xl font-bold text-green-700">{resultado.vencedor.percentual}%</p>
                                            <p className="text-sm text-green-800">{resultado.vencedor.votos} votos</p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {resultado.candidatos.map((candidato) => {
                                        const isWinner = resultado.vencedor?.numero === candidato.numero;
                                        // Converter "100,00" para 100.00 para usar no width
                                        const percentualNumerico = parseFloat(candidato.percentual.replace(',', '.'));

                                        return (
                                            <div key={candidato.numero} className="relative">
                                                <div className="flex justify-between items-end mb-1">
                                                    <div className="flex items-center gap-2">
                                                        {isWinner && <Trophy size={16} className="text-yellow-500" />}
                                                        <span className={`font-semibold ${isWinner ? 'text-gray-900' : 'text-gray-700'}`}>
                                                            {candidato.nome}
                                                        </span>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                            {candidato.partido} - {candidato.numero}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-bold text-gray-900 block">
                                                            {candidato.percentual}%
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {candidato.votos.toLocaleString('pt-BR')} votos
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${isWinner ? 'bg-green-500' : 'bg-[#1351B4]'
                                                            }`}
                                                        style={{ width: `${percentualNumerico}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};
