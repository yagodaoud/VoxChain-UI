import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Users, Hash, CheckCircle2, XCircle, RefreshCw, Search, Copy, ShieldCheck } from 'lucide-react';
import { ApiService } from '../../data/api/ApiService';
import { useAuth } from '../../contexts/AuthContext';
import type { Voto } from '../../domain/voto';
import { Layout, Loading, EmptyState, Card, SubHeader, SectionHeader, Accordion, ErrorModal } from '../components';
import { formatarDataBrasileira } from '../../utils/dateUtils';
import { getErrorMessage } from '../../utils/errorUtils';

interface VotosPorBloco {
    [hash: string]: Voto[];
}

interface VotosPorEleicao {
    [eleicaoId: string]: {
        eleicaoNome: string;
        blocos: VotosPorBloco;
        dataVotacao: Date;
    };
}

export const MeusVotosPage: React.FC = () => {
    const [votos, setVotos] = useState<Voto[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [blocosExpandidos, setBlocosExpandidos] = useState<Record<string, boolean>>({});
    const [validando, setValidando] = useState<Record<string, boolean>>({});
    const [validacoes, setValidacoes] = useState<Record<string, { valido: boolean; mensagem: string }>>({});
    const [carregandoBloco, setCarregandoBloco] = useState<Record<string, boolean>>({});
    const [votosDoBloco, setVotosDoBloco] = useState<Record<string, Voto[]>>({});
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { usuario } = useAuth();
    const api = new ApiService();

    useEffect(() => {
        if (usuario) {
            loadVotos();
        }
    }, [usuario]);

    const loadVotos = async () => {
        setLoading(true);
        try {
            const data = await api.buscarMeusVotos(usuario!.cpf);
            setVotos(data);
        } catch (error) {
            console.error('Erro ao buscar votos:', error);
            const errorMsg = getErrorMessage(error, 'Erro ao carregar seus votos');
            setErrorMessage(errorMsg);
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    // Agrupar votos por eleição e depois por bloco
    const votosPorEleicao: VotosPorEleicao = votos.reduce((acc, voto) => {
        if (!acc[voto.eleicaoId]) {
            acc[voto.eleicaoId] = {
                eleicaoNome: voto.eleicaoNome,
                blocos: {},
                dataVotacao: voto.timestamp
            };
        }

        const hashBloco = voto.hashBlockchain;
        if (!acc[voto.eleicaoId].blocos[hashBloco]) {
            acc[voto.eleicaoId].blocos[hashBloco] = [];
        }
        acc[voto.eleicaoId].blocos[hashBloco].push(voto);

        return acc;
    }, {} as VotosPorEleicao);

    const toggleExpand = (eleicaoId: string) => {
        setExpanded(prev => ({ ...prev, [eleicaoId]: !prev[eleicaoId] }));
    };

    const toggleBlocoExpandido = (hash: string) => {
        setBlocosExpandidos(prev => ({ ...prev, [hash]: !prev[hash] }));
    };

    const copiarHash = (hash: string) => {
        navigator.clipboard.writeText(hash);
        // Poderia adicionar um toast aqui
    };

    const handleValidarBloco = async (hash: string) => {
        setValidando(prev => ({ ...prev, [hash]: true }));
        try {
            const resultado = await api.validarBloco(hash);
            setValidacoes(prev => ({ ...prev, [hash]: resultado }));
        } catch (error) {
            console.error('Erro ao validar bloco:', error);
            const errorMsg = getErrorMessage(error, 'Erro ao validar bloco');
            setErrorMessage(errorMsg);
            setShowErrorModal(true);
            setValidacoes(prev => ({
                ...prev,
                [hash]: { valido: false, mensagem: errorMsg }
            }));
        } finally {
            setValidando(prev => ({ ...prev, [hash]: false }));
        }
    };

    const handleBuscarVotosBloco = async (hash: string) => {
        if (votosDoBloco[hash]) {
            // Se já carregou, apenas expande/colapsa
            toggleBlocoExpandido(hash);
            return;
        }

        setCarregandoBloco(prev => ({ ...prev, [hash]: true }));
        try {
            const votos = await api.buscarVotosPorBloco(hash);
            setVotosDoBloco(prev => ({ ...prev, [hash]: votos }));
            setBlocosExpandidos(prev => ({ ...prev, [hash]: true }));
        } catch (error) {
            console.error('Erro ao buscar votos do bloco:', error);
            const errorMsg = getErrorMessage(error, 'Erro ao buscar votos do bloco');
            setErrorMessage(errorMsg);
            setShowErrorModal(true);
        } finally {
            setCarregandoBloco(prev => ({ ...prev, [hash]: false }));
        }
    };

    const getTotalBlocos = (blocos: VotosPorBloco) => Object.keys(blocos).length;
    const getTotalVotos = (blocos: VotosPorBloco) => Object.values(blocos).reduce((sum, votos) => sum + votos.length, 0);

    return (
        <Layout
            showBackButton={true}
            backPath="/eleicoes"
            backLabel="Voltar às eleições"
            className="bg-[#F8F9FA]"
        >
            <SubHeader />
            <div className="max-w-7xl mx-auto px-4 py-4">
                <SectionHeader
                    icon={FileText}
                    title="Histórico de Votação"
                    subtitle="Consulte os blocos onde seus votos foram registrados"
                />

                {loading ? (
                    <Loading text="Carregando seus votos..." />
                ) : votos.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="Nenhum voto registrado"
                        description="Você ainda não tem votos registrados"
                        className="bg-gray-50 py-24"
                    />
                ) : (
                    <div className="space-y-4">
                        {Object.entries(votosPorEleicao).map(([eleicaoId, dadosEleicao]) => {
                            const totalBlocos = getTotalBlocos(dadosEleicao.blocos);
                            const totalVotos = getTotalVotos(dadosEleicao.blocos);
                            const isOpen = !!expanded[eleicaoId];

                            return (
                                <Card key={eleicaoId} padding="lg">
                                    <Accordion
                                        title={dadosEleicao.eleicaoNome}
                                        subtitle={
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {formatarDataBrasileira(dadosEleicao.dataVotacao)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Hash size={14} />
                                                    {totalBlocos} bloco{totalBlocos !== 1 ? 's' : ''}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    {totalVotos} voto{totalVotos !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        }
                                        isOpen={isOpen}
                                        onToggle={() => toggleExpand(eleicaoId)}
                                    >
                                        {totalBlocos === 0 ? (
                                            <div className="text-center py-6 text-gray-500">
                                                Nenhum bloco registrado nesta eleição
                                            </div>
                                        ) : (
                                            <div className="space-y-4 mt-4">
                                                {Object.entries(dadosEleicao.blocos).map(([hash, votosUsuarioNoBloco]) => {
                                                    const blocoExpandido = !!blocosExpandidos[hash];
                                                    const validacao = validacoes[hash];
                                                    const estaValidando = validando[hash];
                                                    const estaCarregando = carregandoBloco[hash];
                                                    const votosCarregados = votosDoBloco[hash] || votosUsuarioNoBloco;

                                                    return (
                                                        <Card key={hash} padding="md" className="border border-gray-200">
                                                            <div className="space-y-4">
                                                                {/* Cabeçalho do Bloco */}
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <Hash className="text-[#1351B4]" size={18} />
                                                                            <h3 className="font-semibold text-gray-800">Bloco</h3>
                                                                        </div>
                                                                        <div className="bg-gray-100 p-3 rounded-lg mb-2">
                                                                            <p className="text-xs text-gray-600 mb-1 font-medium">Hash do Bloco:</p>
                                                                            <div className="flex items-center gap-2">
                                                                                <p className="font-mono text-xs text-gray-800 break-all flex-1">
                                                                                    {hash}
                                                                                </p>
                                                                                <button
                                                                                    onClick={() => copiarHash(hash)}
                                                                                    className="text-[#1351B4] hover:text-[#0c3d8a] transition-colors"
                                                                                    title="Copiar hash"
                                                                                >
                                                                                    <Copy size={16} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                            <span>{votosUsuarioNoBloco.length} voto{votosUsuarioNoBloco.length !== 1 ? 's' : ''} neste bloco</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Ferramentas do Bloco */}
                                                                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                                                                    <button
                                                                        onClick={() => handleValidarBloco(hash)}
                                                                        disabled={estaValidando}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
                                                                        title="Validar integridade do bloco"
                                                                    >
                                                                        {estaValidando ? (
                                                                            <RefreshCw size={16} className="animate-spin" />
                                                                        ) : (
                                                                            <ShieldCheck size={16} />
                                                                        )}
                                                                        {estaValidando ? 'Validando...' : 'Validar Bloco'}
                                                                    </button>

                                                                    <button
                                                                        onClick={() => handleBuscarVotosBloco(hash)}
                                                                        disabled={estaCarregando}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-[#1351B4] hover:bg-[#0c3d8a] disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
                                                                        title="Ver todos os votos deste bloco"
                                                                    >
                                                                        {estaCarregando ? (
                                                                            <RefreshCw size={16} className="animate-spin" />
                                                                        ) : (
                                                                            <Search size={16} />
                                                                        )}
                                                                        {estaCarregando ? 'Carregando...' : 'Ver Votos do Bloco'}
                                                                    </button>
                                                                </div>

                                                                {/* Resultado da Validação */}
                                                                {validacao && (
                                                                    <div className={`p-3 rounded-lg border ${validacao.valido
                                                                        ? 'bg-green-50 border-green-200'
                                                                        : 'bg-red-50 border-red-200'
                                                                        }`}>
                                                                        <div className="flex items-center gap-2">
                                                                            {validacao.valido ? (
                                                                                <CheckCircle2 className="text-green-600" size={18} />
                                                                            ) : (
                                                                                <XCircle className="text-red-600" size={18} />
                                                                            )}
                                                                            <span className={`font-medium text-sm ${validacao.valido ? 'text-green-800' : 'text-red-800'
                                                                                }`}>
                                                                                {validacao.valido ? 'Bloco Válido' : 'Bloco Inválido'}
                                                                            </span>
                                                                        </div>
                                                                        {validacao.mensagem && (
                                                                            <p className={`text-xs mt-1 ${validacao.valido ? 'text-green-700' : 'text-red-700'
                                                                                }`}>
                                                                                {validacao.mensagem}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Votos do Bloco (expandido) */}
                                                                {blocoExpandido && votosCarregados && (
                                                                    <div className="space-y-3 pt-2 border-t border-gray-200">
                                                                        <h4 className="font-semibold text-gray-700 text-sm">
                                                                            Votos no Bloco ({votosCarregados.length})
                                                                        </h4>
                                                                        {votosCarregados.map((voto: Voto, idx: number) => (
                                                                            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                                                <div className="flex justify-between items-start">
                                                                                    <div className="flex-1">
                                                                                        <h5 className="font-semibold text-gray-800 text-sm mb-1">
                                                                                            {voto.categoriaNome}
                                                                                        </h5>
                                                                                        <p className="text-sm text-gray-600">
                                                                                            Nº {voto.candidatoNumero} - {voto.candidatoNome}
                                                                                        </p>
                                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                                            {formatarDataBrasileira(voto.timestamp)}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Votos do Usuário neste Bloco */}
                                                                <div className="space-y-2 pt-2 border-t border-gray-200">
                                                                    <h4 className="font-semibold text-gray-700 text-sm">
                                                                        Seus Votos neste Bloco ({votosUsuarioNoBloco.length})
                                                                    </h4>
                                                                    {votosUsuarioNoBloco.map((voto: Voto, idx: number) => (
                                                                        <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                                            <div className="flex justify-between items-start">
                                                                                <div className="flex-1">
                                                                                    <h5 className="font-semibold text-gray-800 text-sm mb-1">
                                                                                        {voto.categoriaNome}
                                                                                    </h5>
                                                                                    <p className="text-sm text-gray-600">
                                                                                        Nº {voto.candidatoNumero} - {voto.candidatoNome}
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                                        {formatarDataBrasileira(voto.timestamp)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </Accordion>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Erro"
                message={errorMessage}
            />
        </Layout>
    );
};
