import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, User, Hash, Users } from 'lucide-react';
import { ApiService } from '../../../data/api/ApiService';
import { Layout, GovButton, Loading, Card, AdminSubHeader, ConfirmModal } from '../../components';
import { useAuth } from '../../../contexts/AuthContext';
import type { Candidato } from '../../../domain/candidato';

export const AdminCandidatosPage: React.FC = () => {
    const navigate = useNavigate();
    useAuth();
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState<{ id: string } | null>(null);
    const api = new ApiService();

    useEffect(() => {
        loadCandidatos();
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

    const handleDelete = async () => {
        if (!deleteModalOpen) return;

        try {
            await api.deletarCandidato(deleteModalOpen.id);
            await loadCandidatos();
            setDeleteModalOpen(null);
        } catch (error) {
            console.error('Erro ao deletar candidato:', error);
            alert('Erro ao deletar candidato');
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidatos.map((item, index) => (
                            <Card key={index} hover padding="lg">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="px-3 py-1 bg-[#1351B4] text-white text-xs rounded">
                                            {item.cargo}
                                        </div>
                                        <button
                                            onClick={() => setDeleteModalOpen({
                                                id: item.id
                                            })}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Hash className="text-gray-600" size={18} />
                                            <span className="text-2xl font-bold text-gray-800">
                                                {item.numero}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                                            {item.nome}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {item.partido}
                                        </p>
                                    </div>

                                    {item.fotoUrl && (
                                        <div className="mt-4 w-full h-40 bg-white rounded overflow-hidden p-2">
                                            <img
                                                src={item.fotoUrl}
                                                alt={item.nome}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}

                        {candidatos.length === 0 && (
                            <div className="col-span-full">
                                <Card padding="lg">
                                    <div className="text-center py-12">
                                        <User className="mx-auto text-gray-400 mb-4" size={64} />
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                            Nenhum candidato cadastrado
                                        </h3>
                                        <p className="text-gray-500 mb-6">
                                            Comece adicionando candidatos
                                        </p>
                                        <GovButton onClick={() => navigate('/admin/candidatos/criar')}>
                                            <Plus size={18} />
                                            Adicionar Candidato
                                        </GovButton>
                                    </div>
                                </Card>
                            </div>
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
        </Layout>
    );
};
