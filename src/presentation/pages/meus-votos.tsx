import React, { useState, useEffect } from 'react';
import { FileText, Users, Hash, CheckCircle2, XCircle, RefreshCw, Copy, ShieldCheck, Info } from 'lucide-react';
import { ApiService } from '../../data/api/ApiService';
import { useAuth } from '../../contexts/AuthContext';
import type { BlocoAnonimo } from '../../data/api/services/VotesService';
import { Layout, Loading, EmptyState, Card, SubHeader, SectionHeader, ErrorModal } from '../components';
import { formatarDataBrasileira, formatarDataHoraBrasileira } from '../../utils/dateUtils';
import { getErrorMessage } from '../../utils/errorUtils';

export const MeusVotosPage: React.FC = () => {
    const [blocos, setBlocos] = useState<BlocoAnonimo[]>([]);
    const [loading, setLoading] = useState(true);
    const [validando, setValidando] = useState<Record<string, boolean>>({});
    const [validacoes, setValidacoes] = useState<Record<string, { valido: boolean; mensagem: string }>>({});
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { usuario } = useAuth();
    const api = new ApiService();

    useEffect(() => {
        if (usuario) {
            loadBlocos();
        }
    }, [usuario]);

    const loadBlocos = async () => {
        setLoading(true);
        try {
            const data = await api.buscarMeusVotos(usuario!.cpf);
            setBlocos(data);
        } catch (error) {
            console.error('Erro ao buscar blocos:', error);
            const errorMsg = getErrorMessage(error, 'Erro ao carregar histórico de votação');
            setErrorMessage(errorMsg);
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    const copiarHash = (hash: string) => {
        navigator.clipboard.writeText(hash);
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
                    title="Histórico de Votação (Anônimo)"
                    subtitle="Consulte os blocos onde seus votos foram registrados. Para garantir sua privacidade, mostramos todos os votos do bloco."
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Como funciona a privacidade?</p>
                        <p>
                            Seu voto é registrado em um bloco junto com outros votos.
                            O sistema confirma que seu voto está no bloco, mas não revela qual deles é o seu.
                            Isso garante que seu voto foi contabilizado sem comprometer seu anonimato.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <Loading text="Carregando histórico..." />
                ) : blocos.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="Nenhum voto registrado"
                        description="Você ainda não participou de nenhuma votação."
                        className="bg-gray-50 py-24"
                    />
                ) : (
                    <div className="space-y-6">
                        {blocos.map((bloco) => {
                            const validacao = validacoes[bloco.hash];
                            const estaValidando = validando[bloco.hash];

                            return (
                                <Card key={bloco.hash} padding="lg" className="border border-gray-200">
                                    <div className="space-y-4">
                                        {/* Cabeçalho do Bloco */}
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Hash className="text-[#1351B4]" size={20} />
                                                    <h3 className="font-bold text-gray-800 text-lg">Bloco #{bloco.indice}</h3>
                                                    <span className="text-sm text-gray-500">
                                                        • {formatarDataHoraBrasileira(bloco.timestamp)}
                                                    </span>
                                                </div>

                                                <div className="bg-gray-100 p-3 rounded-lg mb-3 font-mono text-xs text-gray-600 break-all flex items-center gap-2 group">
                                                    <span className="flex-1">{bloco.hash}</span>
                                                    <button
                                                        onClick={() => copiarHash(bloco.hash)}
                                                        className="text-gray-400 hover:text-[#1351B4] opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Copiar hash"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Users size={16} />
                                                        {bloco.totalVotos} votos neste bloco
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleValidarBloco(bloco.hash)}
                                                disabled={estaValidando}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium shrink-0"
                                            >
                                                {estaValidando ? (
                                                    <RefreshCw size={16} className="animate-spin" />
                                                ) : (
                                                    <ShieldCheck size={16} />
                                                )}
                                                {estaValidando ? 'Validando...' : 'Validar Integridade'}
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
                                                        {validacao.valido ? 'Bloco Válido e Íntegro' : 'Bloco Inválido'}
                                                    </span>
                                                </div>
                                                {validacao.mensagem && (
                                                    <p className={`text-xs mt-1 ml-6 ${validacao.valido ? 'text-green-700' : 'text-red-700'
                                                        }`}>
                                                        {validacao.mensagem}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Lista de Votos no Bloco */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <h4 className="font-semibold text-gray-700 text-sm mb-3">
                                                Votos Registrados no Bloco
                                            </h4>
                                            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                                                {bloco.votos.map((voto, idx) => (
                                                    <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-medium text-gray-800">
                                                                {voto.tipoCandidato}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {formatarDataBrasileira(voto.timestamp)}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-mono truncate" title={voto.tokenHash}>
                                                            Token: {voto.tokenHash}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
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
