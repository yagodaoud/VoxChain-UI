import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Eleicao } from '../../domain/eleicao';
import { MockApiService } from '../../data/api/MockApiService';
import type { Candidato } from '../../domain/candidato';
import { Layout, Loading } from '../components';

export const VotacaoPage: React.FC = () => {
    const { eleicaoId } = useParams<{ eleicaoId: string }>();
    const navigate = useNavigate();
    const [eleicao, setEleicao] = useState<Eleicao | null>(null);
    const [categoriaAtual, setCategoriaAtual] = useState(0);
    const [numeroDigitado, setNumeroDigitado] = useState('');
    const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);
    const [votando, setVotando] = useState(false);
    const [loading, setLoading] = useState(true);
    const api = new MockApiService();

    useEffect(() => {
        api.buscarEleicoes().then(eleicoes => {
            const encontrada = eleicoes.find(e => e.id === eleicaoId);
            setEleicao(encontrada || null);
            setLoading(false);
        });
    }, [eleicaoId]);

    const categoria = eleicao?.categorias[categoriaAtual];

    const handleDigito = (digito: string) => {
        if (numeroDigitado.length < 2) {
            const novoNumero = numeroDigitado + digito;
            setNumeroDigitado(novoNumero);

            if (novoNumero.length === 2) {
                const candidato = categoria?.candidatos.find(c => c.numero === novoNumero);
                setCandidatoSelecionado(candidato || null);
            }
        }
    };

    const handleCorrige = () => {
        setNumeroDigitado('');
        setCandidatoSelecionado(null);
    };

    const handleConfirma = async () => {
        if (!candidatoSelecionado || !categoria) return;

        setVotando(true);
        try {
            if (!eleicaoId) return;
            await api.registrarVoto(eleicaoId, categoria.id, numeroDigitado);

            if (categoriaAtual < (eleicao?.categorias.length || 0) - 1) {
                setCategoriaAtual(categoriaAtual + 1);
                handleCorrige();
            } else {
                alert('Votação concluída com sucesso!');
                navigate('/dashboard');
            }
        } catch (error) {
            alert('Erro ao registrar voto');
        } finally {
            setVotando(false);
        }
    };

    if (loading) {
        return (
            <Layout className="bg-[#F8F9FA]" showBackButton={true} backPath="/dashboard" backLabel="Voltar ao Dashboard">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <Loading text="Carregando eleição..." />
                </div>
            </Layout>
        );
    }

    if (!eleicao) {
        return (
            <Layout className="bg-[#F8F9FA]" showBackButton={true} backPath="/dashboard" backLabel="Voltar ao Dashboard">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Eleição não encontrada</h1>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout className="bg-[#F8F9FA]" showBackButton={true} backPath="/dashboard" backLabel="Voltar ao Dashboard">
            <div className="max-w-4xl mx-auto px-4 py-4">

                {/* Botão de voltar sutil */}
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-[#1351B4] hover:underline text-sm font-medium"
                    >
                        ← Voltar
                    </button>
                </div>
                {/* Cabeçalho da Eleição */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{eleicao.nome}</h1>
                            <p className="text-gray-600 text-sm">{eleicao.descricao}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">
                                Categoria {categoriaAtual + 1} de {eleicao.categorias.length}
                            </div>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-[#1351B4] h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((categoriaAtual + 1) / eleicao.categorias.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Urna Eletrônica */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-gray-300">
                    {/* Tela da Urna */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 h-[320px] flex flex-col">
                        <div className="mb-4 text-center">
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{categoria?.nome}</h2>
                            <p className="text-sm text-gray-600">Digite o número do candidato</p>
                        </div>

                        {/* Display do número */}
                        <div className="flex justify-center gap-4 mb-6">
                            <div className="w-20 h-24 bg-white border-4 border-gray-800 rounded-lg flex items-center justify-center text-5xl font-bold text-gray-800 shadow-inner">
                                {numeroDigitado[0] || '_'}
                            </div>
                            <div className="w-20 h-24 bg-white border-4 border-gray-800 rounded-lg flex items-center justify-center text-5xl font-bold text-gray-800 shadow-inner">
                                {numeroDigitado[1] || '_'}
                            </div>
                        </div>

                        {/* Info do Candidato */}
                        {candidatoSelecionado ? (
                            <div className="bg-white p-4 rounded-lg border-2 border-green-500 shadow-sm">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <p className="text-lg font-bold text-gray-800">{candidatoSelecionado.nome}</p>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">{candidatoSelecionado.partido}</p>
                            </div>
                        ) : numeroDigitado.length === 2 ? (
                            <div className="bg-white p-4 rounded-lg border-2 border-red-500 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <p className="text-lg font-bold text-red-600">NÚMERO INVÁLIDO</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                    <p className="text-lg font-bold text-gray-500">Digite o número do candidato</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Teclado */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6">
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                                <button
                                    key={n}
                                    onClick={() => handleDigito(n.toString())}
                                    className="bg-gray-700 text-white text-2xl font-bold py-4 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    {n}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={handleCorrige}
                                className="bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                CORRIGE
                            </button>
                            <button className="bg-gray-600 text-white font-bold py-3 rounded-lg opacity-50 cursor-not-allowed shadow-lg">
                                BRANCO
                            </button>
                            <button
                                onClick={handleConfirma}
                                disabled={!candidatoSelecionado || votando}
                                className="bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                            >
                                {votando ? 'VOTANDO...' : 'CONFIRMA'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};