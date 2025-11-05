import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, User, Hash, Users } from 'lucide-react';
import { ApiService } from '../../../data/api/ApiService';
import { Layout, GovButton, Loading, Card, AdminSubHeader, ConfirmModal, Accordion, ErrorModal } from '../../components';
import { useAuth } from '../../../contexts/AuthContext';
import type { Candidato } from '../../../domain/candidato';
import type { Eleicao } from '../../../domain/eleicao';
import { getErrorMessage } from '../../../utils/errorUtils';

export const AdminCandidatosPage: React.FC = () => {
    const navigate = useNavigate();
    useAuth();
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState<{ id: string } | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const api = new ApiService();

    useEffect(() => {
        loadDados();
    }, []);

    const loadCandidatos = async () => {
        setLoading(true);
        try {
            const candidatos = await api.buscarCandidatos();

            setCandidatos(candidatos);
        } catch (error) {
            console.error('Erro ao carregar candidatos:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadDados = async () => {
        setLoading(true);
        try {
            const [eleicoesResp, candidatosResp] = await Promise.all([
                api.buscarEleicoes(),
                api.buscarCandidatos()
            ]);
            setEleicoes(eleicoesResp);
            setCandidatos(candidatosResp);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (eleicaoId: string) => {
        setExpanded(prev => ({ ...prev, [eleicaoId]: !prev[eleicaoId] }));
    };

    const handleDelete = async () => {
        if (!deleteModalOpen) return;

        try {
            await api.deletarCandidato(deleteModalOpen.id);
            await loadCandidatos();
            setDeleteModalOpen(null);
        } catch (error) {
            console.error('Erro ao deletar candidato:', error);
            const errorMsg = getErrorMessage(error, 'Erro ao deletar candidato');
            setErrorMessage(errorMsg);
            setShowErrorModal(true);
        }
    };

    return (
        <Layout className="bg-[#F8F9FA]">
            <AdminSubHeader />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="text-[#1351B4]" size={32} />
                            <h1 className="text-4xl font-bold text-gray-800">Gerenciar Candidatos</h1>
                        </div>
                        <p className="text-gray-600">Visualize e gerencie todos os candidatos cadastrados</p>
                    </div>
                    <GovButton onClick={() => navigate('/admin/candidatos/criar')}>
                        <Plus size={18} />
                        Novo Candidato
                    </GovButton>
                </div>

                {loading ? (
                    <Loading text="Carregando candidatos..." />
                ) : (
                    <div className="space-y-4">
                        {eleicoes.map((eleicao) => {
                            const candidatosDaEleicao = candidatos.filter(c => c.eleicaoId === eleicao.id);
                            const isOpen = !!expanded[eleicao.id];
                            return (
                                <Card key={eleicao.id} padding="lg">
                                    <Accordion
                                        title={eleicao.nome}
                                        subtitle={`${candidatosDaEleicao.length} candidato(s)`}
                                        isOpen={isOpen}
                                        onToggle={() => toggleExpand(eleicao.id)}
                                    >
                                        {candidatosDaEleicao.length === 0 ? (
                                            <div className="text-center py-6 text-gray-500">Nenhum candidato nesta eleição</div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {candidatosDaEleicao.map((item) => (
                                                    <Card key={item.id} hover padding="lg">
                                                        <div className="flex flex-col h-full">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="px-3 py-1 bg-[#1351B4] text-white text-xs rounded">
                                                                    {item.cargo}
                                                                </div>
                                                                <button
                                                                    onClick={() => setDeleteModalOpen({ id: item.id })}
                                                                    className="text-red-600 hover:text-red-800"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                            <div className="flex-grow">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Hash className="text-gray-600" size={18} />
                                                                    <span className="text-2xl font-bold text-gray-800">{item.numero}</span>
                                                                </div>
                                                                <h3 className="text-xl font-bold text-gray-800 mb-1">{item.nome}</h3>
                                                                <p className="text-gray-600 text-sm">{item.partido}</p>
                                                            </div>
                                                            {item.fotoUrl && (
                                                                <div className="mt-4 w-full h-40 bg-white rounded overflow-hidden p-2">
                                                                    <img src={item.fotoUrl} alt={item.nome} className="w-full h-full object-contain" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </Accordion>
                                </Card>
                            );
                        })}

                        {eleicoes.length === 0 && (
                            <Card padding="lg">
                                <div className="text-center py-12">
                                    <User className="mx-auto text-gray-400 mb-4" size={64} />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma eleição encontrada</h3>
                                    <p className="text-gray-500 mb-6">Crie uma eleição e adicione candidatos</p>
                                    <div className="flex gap-2 justify-center">
                                        <GovButton onClick={() => navigate('/admin/eleicoes/criar')}>Criar Eleição</GovButton>
                                        <GovButton onClick={() => navigate('/admin/candidatos/criar')} variant="secondary">
                                            <Plus size={18} />
                                            Adicionar Candidato
                                        </GovButton>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <ConfirmModal
                    isOpen={!!deleteModalOpen}
                    onClose={() => setDeleteModalOpen(null)}
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o candidato "${deleteModalOpen.id}"? Esta ação não pode ser desfeita.`}
                    confirmText="Deletar"
                    cancelText="Cancelar"
                    onConfirm={handleDelete}
                />
            )}

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Erro"
                message={errorMessage}
            />
        </Layout>
    );
};
