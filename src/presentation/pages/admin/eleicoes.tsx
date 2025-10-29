import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Calendar, Vote } from 'lucide-react';
import type { Eleicao } from '../../../domain/eleicao';
import { MockApiService } from '../../../data/api/MockApiService';
import { Layout, GovButton, Loading, StatusBadge, Card, AdminSubHeader, ConfirmModal } from '../../components';
import { formatarDataHoraLegivel } from '../../../utils/dateUtils';
import { useAuth } from '../../../contexts/AuthContext';

export const AdminEleicoesPage: React.FC = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState<{ id: string; nome: string } | null>(null);
    const api = new MockApiService();

    useEffect(() => {
        loadEleicoes();
    }, []);

    const loadEleicoes = async () => {
        setLoading(true);
        try {
            const data = await api.buscarEleicoes();
            setEleicoes(data);
        } catch (error) {
            console.error('Erro ao carregar eleições:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.deletarEleicao(id);
            setEleicoes(prev => prev.filter(e => e.id !== id));
            setDeleteModalOpen(null);
        } catch (error) {
            console.error('Erro ao deletar eleição:', error);
            alert('Erro ao deletar eleição');
        }
    };

    const getTotalCategorias = (eleicao: Eleicao) => eleicao.categorias.length;

    const getTotalCandidatos = (eleicao: Eleicao) => {
        return eleicao.categorias.reduce((total, cat) => total + cat.candidatos.length, 0);
    };

    return (
        <Layout className="bg-[#F8F9FA]">
            <AdminSubHeader />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Vote className="text-[#1351B4]" size={32} />
                            <h1 className="text-4xl font-bold text-gray-800">Gerenciar Eleições</h1>
                        </div>
                        <p className="text-gray-600">Crie e gerencie todas as eleições do sistema</p>
                    </div>
                    <GovButton onClick={() => navigate('/admin/eleicoes/criar')}>
                        <Plus size={18} />
                        Nova Eleição
                    </GovButton>
                </div>

                {loading ? (
                    <Loading text="Carregando eleições..." />
                ) : (
                    <div className="grid gap-6">
                        {eleicoes.map(eleicao => (
                            <Card key={eleicao.id} hover padding="lg">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            {eleicao.nome}
                                        </h2>
                                        <p className="text-gray-600 mb-4">{eleicao.descricao}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar size={18} />
                                                <span className="text-sm">
                                                    <strong>Início:</strong>{' '}
                                                    {formatarDataHoraLegivel(eleicao.dataInicio)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar size={18} />
                                                <span className="text-sm">
                                                    <strong>Fim:</strong>{' '}
                                                    {formatarDataHoraLegivel(eleicao.dataFim)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Vote size={18} />
                                                <span className="text-sm">
                                                    <strong>Categorias:</strong> {getTotalCategorias(eleicao)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                                {getTotalCandidatos(eleicao)} candidatos
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        <StatusBadge status={eleicao.status as 'ativa' | 'futura' | 'encerrada'} />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                                    <GovButton
                                        onClick={() => navigate(`/admin/eleicoes/editar/${eleicao.id}`)}
                                        variant="secondary"
                                        className="flex-1"
                                    >
                                        <Edit size={18} />
                                        Editar
                                    </GovButton>
                                    <GovButton
                                        onClick={() => setDeleteModalOpen({ id: eleicao.id, nome: eleicao.nome })}
                                        variant="secondary"
                                        className="flex-1"
                                    >
                                        <Trash2 size={18} />
                                        Deletar
                                    </GovButton>
                                </div>
                            </Card>
                        ))}

                        {eleicoes.length === 0 && (
                            <Card padding="lg">
                                <div className="text-center py-12">
                                    <Vote className="mx-auto text-gray-400 mb-4" size={64} />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        Nenhuma eleição cadastrada
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Comece criando uma nova eleição
                                    </p>
                                    <GovButton onClick={() => navigate('/admin/eleicoes/criar')}>
                                        <Plus size={18} />
                                        Criar Primeira Eleição
                                    </GovButton>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <ConfirmModal
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir a eleição "${deleteModalOpen.nome}"? Esta ação não pode ser desfeita.`}
                    confirmText="Deletar"
                    cancelText="Cancelar"
                    onConfirm={() => handleDelete(deleteModalOpen.id)}
                    onCancel={() => setDeleteModalOpen(null)}
                />
            )}
        </Layout>
    );
};
