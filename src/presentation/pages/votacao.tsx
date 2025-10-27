import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Eleicao } from '../../domain/eleicao';
import { MockApiService } from '../../data/api/MockApiService';
import type { Candidato } from '../../domain/candidato';
import { Layout, Loading, ElectionHeader, ElectronicBallot } from '../components';

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
                <ElectionHeader eleicao={eleicao} categoriaAtual={categoriaAtual} />

                {/* Urna Eletrônica */}
                <ElectronicBallot
                    categoria={categoria}
                    numeroDigitado={numeroDigitado}
                    candidatoSelecionado={candidatoSelecionado}
                    onDigito={handleDigito}
                    onCorrige={handleCorrige}
                    onConfirma={handleConfirma}
                    votando={votando}
                />
            </div>
        </Layout>
    );
};