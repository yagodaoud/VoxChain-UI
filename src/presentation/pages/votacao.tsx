import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Eleicao } from '../../domain/eleicao';
import { MockApiService } from '../../data/api/MockApiService';
import type { Candidato } from '../../domain/candidato';

export const VotacaoPage: React.FC = () => {
    const { eleicaoId } = useParams<{ eleicaoId: string }>();
    const navigate = useNavigate();
    const [eleicao, setEleicao] = useState<Eleicao | null>(null);
    const [categoriaAtual, setCategoriaAtual] = useState(0);
    const [numeroDigitado, setNumeroDigitado] = useState('');
    const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);
    const [votando, setVotando] = useState(false);
    const api = new MockApiService();

    useEffect(() => {
        api.buscarEleicoes().then(eleicoes => {
            const encontrada = eleicoes.find(e => e.id === eleicaoId);
            setEleicao(encontrada || null);
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

    if (!eleicao) return <div>Carregando...</div>;

    return (
        <div className="min-h-screen bg-[#F8F9FA] py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-gray-300">
                    {/* Tela da Urna */}
                    <div className="bg-gray-100 p-8 min-h-[400px] flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{categoria?.nome}</h2>
                            <p className="text-sm text-gray-600">Digite o número do candidato</p>
                        </div>

                        {/* Display do número */}
                        <div className="flex gap-4 mb-8">
                            <div className="w-16 h-20 bg-white border-4 border-gray-800 rounded flex items-center justify-center text-4xl font-bold">
                                {numeroDigitado[0] || '_'}
                            </div>
                            <div className="w-16 h-20 bg-white border-4 border-gray-800 rounded flex items-center justify-center text-4xl font-bold">
                                {numeroDigitado[1] || '_'}
                            </div>
                        </div>

                        {/* Info do Candidato */}
                        {candidatoSelecionado ? (
                            <div className="bg-white p-6 rounded border-2 border-green-500">
                                <p className="text-lg font-bold text-gray-800 mb-1">{candidatoSelecionado.nome}</p>
                                <p className="text-sm text-gray-600">{candidatoSelecionado.partido}</p>
                            </div>
                        ) : numeroDigitado.length === 2 ? (
                            <div className="bg-white p-6 rounded border-2 border-red-500">
                                <p className="text-lg font-bold text-red-600">NÚMERO INVÁLIDO</p>
                            </div>
                        ) : null}
                    </div>

                    {/* Teclado */}
                    <div className="bg-gray-800 p-6">
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                                <button
                                    key={n}
                                    onClick={() => handleDigito(n.toString())}
                                    className="bg-gray-900 text-white text-2xl font-bold py-4 rounded hover:bg-gray-700 transition"
                                >
                                    {n}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={handleCorrige}
                                className="bg-orange-500 text-white font-bold py-3 rounded hover:bg-orange-600 transition"
                            >
                                CORRIGE
                            </button>
                            <button className="bg-gray-600 text-white font-bold py-3 rounded opacity-50 cursor-not-allowed">
                                BRANCO
                            </button>
                            <button
                                onClick={handleConfirma}
                                disabled={!candidatoSelecionado || votando}
                                className="bg-green-500 text-white font-bold py-3 rounded hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {votando ? 'VOTANDO...' : 'CONFIRMA'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-[#1351B4] hover:underline"
                    >
                        ← Voltar ao Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};