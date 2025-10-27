import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, FileText } from 'lucide-react';
import { MockApiService } from '../../data/api/MockApiService';
import { useAuth } from '../../contexts/AuthContext'
import type { Voto } from '../../domain/voto';
import { Layout, Loading, EmptyState, Card } from '../components';
import { formatarDataBrasileira } from '../../utils/dateUtils';

export const MeusVotosPage: React.FC = () => {
    const [votos, setVotos] = useState<Voto[]>([]);
    const [loading, setLoading] = useState(true);
    const [hashVisivel, setHashVisivel] = useState<string | null>(null);
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

    return (
        <Layout
            showBackButton={true}
            backPath="/dashboard"
            backLabel="Voltar ao dashboard"
            className="bg-[#F8F9FA]"
        >
            <div className="max-w-4xl mx-auto px-4 py-8">
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
                    <div className="space-y-4">
                        {votos.map((voto, idx) => (
                            <Card key={idx}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{voto.eleicaoNome}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{voto.categoriaNome}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {formatarDataBrasileira(voto.timestamp)}
                                    </span>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Voto registrado:</span>
                                        <button
                                            onClick={() => setHashVisivel(hashVisivel === voto.hashBlockchain ? null : voto.hashBlockchain)}
                                            className="text-[#1351B4] hover:text-[#0c3d8a] transition"
                                        >
                                            {hashVisivel === voto.hashBlockchain ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {hashVisivel === voto.hashBlockchain ? (
                                        <div>
                                            <p className="font-mono text-xs text-gray-800 break-all mb-2">
                                                Nº {voto.candidatoNumero} - {voto.candidatoNome}
                                            </p>
                                            <div className="bg-gray-100 p-3 rounded">
                                                <p className="text-xs text-gray-600 mb-1">Hash Blockchain:</p>
                                                <p className="font-mono text-xs text-gray-800 break-all">
                                                    {voto.hashBlockchain}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600">Clique no ícone para revelar os detalhes</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <CheckCircle size={16} />
                                    <span>Voto registrado com sucesso na blockchain</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};