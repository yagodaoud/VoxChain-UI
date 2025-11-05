import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Trash2, IdCard, FileText } from 'lucide-react';
import { Layout, GovButton, Card, Loading, AdminSubHeader, ConfirmModal, EmptyState, ErrorModal } from '../../components';
import { ApiService } from '../../../data/api/ApiService';
import type { Eleitor } from '../../../domain/eleitor';
import { getErrorMessage } from '../../../utils/errorUtils';

export const AdminEleitoresPage: React.FC = () => {
    const navigate = useNavigate();
    const api = new ApiService();

    const [eleitores, setEleitores] = useState<Eleitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const shortenHash = (hash: string, prefix: number = 6, suffix: number = 4) => {
        if (!hash) return '';
        if (hash.length <= prefix + suffix) return hash;
        return `${hash.slice(0, prefix)}...${hash.slice(-suffix)}`;
    };

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setLoading(true);
        try {
            const data = await api.listarEleitores();
            setEleitores(data);
        } catch (error) {
            console.error('Erro ao carregar eleitores:', error);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        if (!deleteModalOpen) return;
        try {
            await api.deletarEleitor(deleteModalOpen);
            setDeleteModalOpen(null);
            await load();
        } catch (error) {
            console.error('Erro ao deletar eleitor:', error);
            const errorMsg = getErrorMessage(error, 'Erro ao deletar eleitor');
            setErrorMessage(errorMsg);
            setShowErrorModal(true);
        }
    };

    return (
        <Layout className="bg-[#F8F9FA]">
            <AdminSubHeader />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="text-[#1351B4]" size={32} />
                            <h1 className="text-4xl font-bold text-gray-800">Gerenciar Eleitores</h1>
                        </div>
                        <p className="text-gray-600">Visualize e gerencie os eleitores cadastrados</p>
                    </div>
                    <GovButton onClick={() => navigate('/admin/eleitores/criar')}>
                        <Plus size={18} />
                        Novo Eleitor
                    </GovButton>
                </div>

                {loading ? (
                    <Loading text="Carregando eleitores..." />
                ) : eleitores.length === 0 ? (
                    <Card padding="lg">
                        <EmptyState
                            icon={FileText}
                            title="Nenhum eleitor cadastrado"
                            description="Crie um novo eleitor para começar"
                            className="bg-gray-50 py-24"
                        />
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {eleitores.map((e) => (
                            <Card key={e.cpfHash} hover padding="lg">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <IdCard className="text-gray-600" size={18} />
                                        <span className="text-sm text-gray-500 break-all">{shortenHash(e.cpfHash)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/eleitores/editar/${e.cpfHash}`)}
                                            className="text-[#1351B4] hover:text-[#0c3d8a] text-sm font-medium"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => setDeleteModalOpen(e.cpfHash)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-gray-700">
                                    <div><span className="text-gray-500">Zona: </span><span className="font-semibold">{e.zona}</span></div>
                                    <div><span className="text-gray-500">Seção: </span><span className="font-semibold">{e.secao}</span></div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {deleteModalOpen && (
                <ConfirmModal
                    isOpen={!!deleteModalOpen}
                    onClose={() => setDeleteModalOpen(null)}
                    title="Confirmar Exclusão"
                    message="Tem certeza que deseja excluir este eleitor?"
                    confirmText="Deletar"
                    cancelText="Cancelar"
                    onConfirm={onDelete}
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


