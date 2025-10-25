import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, FileText } from 'lucide-react';
import { MockApiService } from '../../data/api/MockApiService';
import { useAuth } from '../../contexts/AuthContext'
import type { Voto } from '../../domain/voto';

export const MeusVotosPage: React.FC = () => {
    const navigate = useNavigate();
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
        <div className="min-h-screen bg-[#F8F9FA]">
            <header className="bg-[#071D41] text-white py-4">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1351B4] rounded flex items-center justify-center font-bold text-xl">
                            V
                        </div>
                        <div>
                            <div className="font-bold text-lg">Meus Votos</div>
                            <div className="text-xs text-gray-300">{usuario?.nome}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-[#1351B4] rounded hover:bg-[#0c3d8a] transition text-sm"
                    >
                        Voltar
                    </button>
                </div>
            </header>

            <div className="bg-[#1351B4] h-2"></div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Histórico de Votação</h1>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1351B4] mx-auto"></div>
                    </div>
                ) : votos.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                        <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Você ainda não tem votos registrados</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {votos.map((voto, idx) => (
                            <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{voto.eleicaoNome}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{voto.categoriaNome}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {voto.timestamp.toLocaleDateString()}
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};