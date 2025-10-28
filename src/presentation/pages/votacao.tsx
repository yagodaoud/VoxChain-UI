import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Eleicao } from '../../domain/eleicao';
import { MockApiService } from '../../data/api/MockApiService';
import type { Candidato } from '../../domain/candidato';
import { Layout, Loading, ElectionHeader, ElectronicBallot, VotingSuccessModal, ConfirmModal } from '../components';

export const VotacaoPage: React.FC = () => {
    const { eleicaoId } = useParams<{ eleicaoId: string }>();
    const navigate = useNavigate();
    const [eleicao, setEleicao] = useState<Eleicao | null>(null);
    const [categoriaAtual, setCategoriaAtual] = useState(0);
    const [numeroDigitado, setNumeroDigitado] = useState('');
    const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);
    const [votandoEmBranco, setVotandoEmBranco] = useState(false);
    const [votosTemporarios, setVotosTemporarios] = useState<Array<{ categoriaId: string, numeroVoto: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [votando, setVotando] = useState(false);
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
            setVotandoEmBranco(false); // Reset voto em branco quando digita

            if (novoNumero.length === 2) {
                const candidato = categoria?.candidatos.find(c => c.numero === novoNumero);
                setCandidatoSelecionado(candidato || null);
            }
        }
    };

    const handleCorrige = () => {
        setNumeroDigitado('');
        setCandidatoSelecionado(null);
        setVotandoEmBranco(false);
    };


    const handleBranco = () => {
        setNumeroDigitado('');
        setCandidatoSelecionado(null);
        setVotandoEmBranco(true);
    };

    const handleConfirma = async () => {
        if (!categoria) return;

        // Valida se um voto foi selecionado (candidato ou branco)
        if (!votandoEmBranco && !candidatoSelecionado) {
            alert('Por favor, selecione um candidato ou clique em BRANCO antes de confirmar.');
            return;
        }

        try {
            if (!eleicaoId) return;

            // Determina o número do voto (candidato ou branco)
            const numeroVoto = votandoEmBranco ? 'BRANCO' : (candidatoSelecionado ? numeroDigitado : 'BRANCO');

            // Adiciona o voto ao array temporário
            const novoVoto = { categoriaId: categoria.id, numeroVoto };
            const novosVotos = [...votosTemporarios, novoVoto];
            setVotosTemporarios(novosVotos);

            // Verifica se é a última categoria
            const totalCategorias = eleicao?.categorias.length || 0;
            const isUltimaCategoria = categoriaAtual >= totalCategorias - 1;

            if (isUltimaCategoria) {
                // Última categoria - registra todos os votos em batch
                setVotando(true);
                await api.registrarVotosBatch(eleicaoId, novosVotos);
                setVotando(false);
                setShowSuccessModal(true);
            } else {
                // Não é a última categoria - apenas avança
                setCategoriaAtual(categoriaAtual + 1);
                handleCorrige();
            }
        } catch (error) {
            setVotando(false);
            alert('Erro ao registrar voto');
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        // Limpa todos os votos temporários após sucesso
        setVotosTemporarios([]);
        navigate('/eleicoes');
    };

    const handleBackClick = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmBack = () => {
        // Limpa todos os votos temporários
        setVotosTemporarios([]);
        navigate('/eleicoes');
    };

    if (loading) {
        return (
            <Layout className="bg-[#F8F9FA]" showBackButton={true} backPath="/eleicoes" backLabel="Voltar às Eleições">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <Loading text="Carregando eleição..." />
                </div>
            </Layout>
        );
    }

    if (!eleicao) {
        return (
            <Layout className="bg-[#F8F9FA]" showBackButton={true} backPath="/eleicoes" backLabel="Voltar às Eleições">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Eleição não encontrada</h1>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout className="bg-[#F8F9FA]" showBackButton={true} backPath="/eleicoes" backLabel="Voltar às Eleições">
            <div className="max-w-4xl mx-auto px-4 py-4">
                {/* Botão de voltar sutil */}
                <div className="mb-4">
                    <button
                        onClick={handleBackClick}
                        className="text-[#1351B4] hover:underline text-sm font-medium"
                    >
                        ← Voltar às eleições
                    </button>
                </div>

                {/* Cabeçalho da Eleição */}
                <ElectionHeader eleicao={eleicao} categoriaAtual={categoriaAtual} />

                {/* Urna Eletrônica */}
                <ElectronicBallot
                    categoria={categoria}
                    numeroDigitado={numeroDigitado}
                    candidatoSelecionado={candidatoSelecionado}
                    votandoEmBranco={votandoEmBranco}
                    onDigito={handleDigito}
                    onCorrige={handleCorrige}
                    onConfirma={handleConfirma}
                    onBranco={handleBranco}
                    votando={votando}
                    isUltimaCategoria={eleicao?.categorias ? categoriaAtual >= eleicao.categorias.length - 1 : false}
                    canConfirm={votandoEmBranco || !!candidatoSelecionado}
                />
            </div>

            {/* Modal de Sucesso */}
            <VotingSuccessModal
                isOpen={showSuccessModal}
                onClose={handleSuccessModalClose}
                eleicaoNome={eleicao?.nome}
                onConfirm={handleSuccessModalClose}
            />

            {/* Modal de Confirmação para Voltar */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmBack}
                title="Atenção!"
                message="Ao voltar às eleições, seu voto atual será perdido. Tem certeza que deseja continuar?"
                confirmText="Sim, voltar"
                cancelText="Cancelar"
                confirmButtonColor="bg-red-500 hover:bg-red-600"
            />
        </Layout>
    );
};