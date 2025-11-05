import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Eleicao } from '../../domain/eleicao';
import { ApiService } from '../../data/api/ApiService';
import type { Candidato } from '../../domain/candidato';
import type { Categoria } from '../../domain/categoria';
import { Layout, Loading, ElectionHeader, ElectronicBallot, VotingSuccessModal, ConfirmModal, TokenConfirmation } from '../components';
import { VoteConfirmModal } from '../components/voting/VoteConfirmModal';
import axios from 'axios';

interface TokenVotacao {
    tokenAnonimo: string;
    validoAte: number;
    eleicaoId: string;
    usado: boolean;
}

const getTokenStorageKey = (eleicaoId: string) => `token_votacao_${eleicaoId}`;

const getTokenFromStorage = (eleicaoId: string): TokenVotacao | null => {
    try {
        const stored = localStorage.getItem(getTokenStorageKey(eleicaoId));
        if (!stored) return null;
        const token: TokenVotacao = JSON.parse(stored);
        // Verifica se o token ainda é válido (não expirado e não usado)
        const agora = Date.now();
        if (token.validoAte < agora || token.usado) {
            localStorage.removeItem(getTokenStorageKey(eleicaoId));
            return null;
        }
        return token;
    } catch {
        return null;
    }
};

const saveTokenToStorage = (token: TokenVotacao): void => {
    try {
        localStorage.setItem(getTokenStorageKey(token.eleicaoId), JSON.stringify(token));
    } catch (error) {
        console.error('Erro ao salvar token no localStorage:', error);
    }
};

const markTokenAsUsed = (eleicaoId: string): void => {
    try {
        const stored = localStorage.getItem(getTokenStorageKey(eleicaoId));
        if (stored) {
            const token: TokenVotacao = JSON.parse(stored);
            token.usado = true;
            localStorage.setItem(getTokenStorageKey(eleicaoId), JSON.stringify(token));
        }
    } catch (error) {
        console.error('Erro ao marcar token como usado:', error);
    }
};

export const VotacaoPage: React.FC = () => {
    const { eleicaoId } = useParams<{ eleicaoId: string }>();
    const navigate = useNavigate();
    const [eleicao, setEleicao] = useState<Eleicao | null>(null);
    const [categoriasComCandidatos, setCategoriasComCandidatos] = useState<Categoria[]>([]);
    const [categoriaAtual, setCategoriaAtual] = useState(0);
    const [numeroDigitado, setNumeroDigitado] = useState('');
    const [candidatoSelecionado, setCandidatoSelecionado] = useState<Candidato | null>(null);
    const [votandoEmBranco, setVotandoEmBranco] = useState(false);
    const [votosTemporarios, setVotosTemporarios] = useState<Array<{ categoriaId: string, numeroVoto: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showVoteConfirmModal, setShowVoteConfirmModal] = useState(false);
    const [votando, setVotando] = useState(false);
    const [tokenVotacao, setTokenVotacao] = useState<string | null>(null);
    const [tokenValidoAte, setTokenValidoAte] = useState<number>(0);
    const [gerandoToken, setGerandoToken] = useState(false);
    const [tokenConfirmado, setTokenConfirmado] = useState(false);
    const api = new ApiService();

    useEffect(() => {
        const carregarEleicaoECandidatos = async () => {
            try {
                const eleicoes = await api.buscarEleicoes();
                const encontrada = eleicoes.find(e => e.id === eleicaoId);

                if (!encontrada) {
                    setEleicao(null);
                    setLoading(false);
                    return;
                }

                setEleicao(encontrada);

                // Buscar candidatos da eleição
                const candidatos = await api.buscarCandidatosPorEleicao(eleicaoId!);

                // Organizar candidatos por categoria
                const categorias: Categoria[] = encontrada.categorias.map((categoriaEnum, index) => {
                    const candidatosDaCategoria = candidatos.filter(
                        c => c.cargo === categoriaEnum
                    );

                    return {
                        id: `${encontrada.id}-${categoriaEnum}-${index}`,
                        nome: categoriaEnum,
                        candidatos: candidatosDaCategoria
                    };
                });

                setCategoriasComCandidatos(categorias);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar eleição e candidatos:', error);
                setLoading(false);
            }
        };

        carregarEleicaoECandidatos();
    }, [eleicaoId]);

    // Gerar token ao carregar
    useEffect(() => {
        const gerarToken = async () => {
            if (!eleicao || tokenVotacao) return;

            // Primeiro, tenta carregar do localStorage
            const tokenSalvo = getTokenFromStorage(eleicaoId!);
            if (tokenSalvo) {
                setTokenVotacao(tokenSalvo.tokenAnonimo);
                setTokenValidoAte(tokenSalvo.validoAte);
                return;
            }

            setGerandoToken(true);
            try {
                const { tokenAnonimo, validoAte } = await api.gerarTokenVotacao(eleicaoId!);
                const novoToken: TokenVotacao = {
                    tokenAnonimo,
                    validoAte,
                    eleicaoId: eleicaoId!,
                    usado: false
                };
                saveTokenToStorage(novoToken);
                setTokenVotacao(tokenAnonimo);
                setTokenValidoAte(validoAte);
            } catch (error) {
                // Se der erro 409, tenta usar token do localStorage
                if (axios.isAxiosError(error) && error.response?.status === 409) {
                    const tokenSalvo = getTokenFromStorage(eleicaoId!);
                    if (tokenSalvo) {
                        setTokenVotacao(tokenSalvo.tokenAnonimo);
                        setTokenValidoAte(tokenSalvo.validoAte);
                        setGerandoToken(false);
                        return;
                    }
                }
                // Se não conseguiu usar token do localStorage, mostra erro
                alert('Erro ao gerar token. Você já pode ter votado nesta eleição.');
                navigate('/eleicoes');
            } finally {
                setGerandoToken(false);
            }
        };

        if (eleicao) {
            gerarToken();
        }
    }, [eleicao]);

    const categoria = categoriasComCandidatos[categoriaAtual];

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

    const handleConfirma = () => {
        if (!categoria) return;

        // Valida se um voto foi selecionado (candidato ou branco)
        if (!votandoEmBranco && !candidatoSelecionado) {
            alert('Por favor, selecione um candidato ou clique em BRANCO antes de confirmar.');
            return;
        }

        // Mostra modal de confirmação antes de prosseguir
        setShowVoteConfirmModal(true);
    };

    const handleConfirmarVoto = async () => {
        if (!categoria || !eleicaoId) return;

        try {
            // Determina o número do voto (candidato ou branco)
            const numeroVoto = votandoEmBranco ? 'BRANCO' : (candidatoSelecionado ? numeroDigitado : 'BRANCO');

            // Adiciona o voto ao array temporário
            const novoVoto = { categoriaId: categoria.id, numeroVoto };
            const novosVotos = [...votosTemporarios, novoVoto];
            setVotosTemporarios(novosVotos);

            // Verifica se é a última categoria
            const totalCategorias = categoriasComCandidatos.length;
            const isUltimaCategoria = categoriaAtual >= totalCategorias - 1;

            if (isUltimaCategoria) {
                // Última categoria - registra todos os votos em batch
                if (!tokenVotacao) {
                    alert('Token inválido');
                    return;
                }
                setVotando(true);
                setShowVoteConfirmModal(false);
                await api.registrarVotosBatch(tokenVotacao, eleicaoId, novosVotos);
                // Marca o token como usado após sucesso
                markTokenAsUsed(eleicaoId);
                setVotando(false);
                setShowSuccessModal(true);
            } else {
                // Não é a última categoria - apenas avança
                setShowVoteConfirmModal(false);
                const novaCategoria = categoriaAtual + 1;
                setCategoriaAtual(novaCategoria);
                // Reset para a próxima categoria
                setNumeroDigitado('');
                setCandidatoSelecionado(null);
                setVotandoEmBranco(false);
            }
        } catch (error) {
            setVotando(false);
            setShowVoteConfirmModal(false);
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

    if (loading || gerandoToken) {
        return (
            <Layout className="bg-[#F8F9FA]" showBackButton={true} backPath="/eleicoes" backLabel="Voltar às Eleições">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <Loading text={gerandoToken ? "Gerando token anônimo..." : "Carregando eleição..."} />
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

    if (tokenVotacao && !tokenConfirmado) {
        return (
            <Layout className="bg-[#F8F9FA]" showBackButton={true} backPath="/eleicoes" backLabel="Voltar às Eleições">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <TokenConfirmation
                        tokenValidoAte={tokenValidoAte}
                        onContinuar={() => setTokenConfirmado(true)}
                    />
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
                    isUltimaCategoria={categoriasComCandidatos.length > 0 ? categoriaAtual >= categoriasComCandidatos.length - 1 : false}
                    canConfirm={votandoEmBranco || !!candidatoSelecionado}
                />
            </div>

            {/* Modal de Confirmação de Voto */}
            <VoteConfirmModal
                isOpen={showVoteConfirmModal}
                onClose={() => setShowVoteConfirmModal(false)}
                onConfirm={handleConfirmarVoto}
                candidato={candidatoSelecionado}
                votandoEmBranco={votandoEmBranco}
                categoriaNome={categoria?.nome || ''}
                isUltimaCategoria={categoriasComCandidatos.length > 0 ? categoriaAtual >= categoriasComCandidatos.length - 1 : false}
            />

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