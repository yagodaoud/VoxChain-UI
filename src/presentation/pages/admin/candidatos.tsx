import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, User, Hash } from 'lucide-react';
import { MockApiService } from '../../../data/api/MockApiService';
import { Layout, GovButton, Loading, Card, AdminSubHeader, ConfirmModal } from '../../components';
import { useAuth } from '../../../contexts/AuthContext';
import type { Candidato } from '../../../domain/candidato';

interface CandidatoCompleto {
    categoriaId: string;
    categoriaNome: string;
    candidato: Candidato;
}

export const AdminCandidatosPage: React.FC = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [candidatos, setCandidatos] = useState<CandidatoCompleto[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState<{ categoriaId: string; numero: string; nome: string } | null>(null);
    const [selectedCategoria, setSelectedCategoria] = useState<string>('');
    const api = new MockApiService();

    useEffect(() => {
        loadCandidatos();
    }, []);

    const loadCandidatos = async () => {
        setLoading(true);
        try {
            const data = await api.buscarCandidatos();
            // We need to get category names from elections
            const eleicoes = await api.buscarEleicoes();
            const candidatosCompletos: CandidatoCompleto[] = [];

            data.forEach(({ categoriaId, candidato }) => {
                eleicoes.forEach(eleicao => {
                    const categoria = eleicao.categorias.find(cat => cat.id === categoriaId);
                    if (categoria) {
                        candidatosCompletos.push({
                            categoriaId,
                            categoriaNome: categoria.nome,
                            candidato
                        });
                    }
                });
            });

            setCandidatos(candidatosCompletos);
        } catch (error) {
            console.error('Erro ao carregar candidatos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModalOpen) return;

        try {
            await api.deletarCandidato(deleteModalOpen.categoriaId, deleteModalOpen.numero);
            await loadCandidatos();
            setDeleteModalOpen(null);
        } catch (error) {
            console.error('Erro ao deletar candidato:', error);
            alert('Erro ao deletar candidato');
        }
    };

    const categoriasUnicas = Array.from(new Set(candidatos.map(c => c.categoriaNome)));

    const candidatosFiltrados = selectedCategoria
        ? candidatos.filter(c => c.categoriaNome === selectedCategoria)
        : candidatos;

    return (
        <Layout className="bg-[#F8F9FA]">
            <AdminSubHeader />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Gerenciar Candidatos</h1>
                        <p className="text-gray-600">Visualize e gerencie todos os candidatos cadastrados</p>
                    </div>
                    <GovButton onClick={() => navigate('/admin/candidatos/criar')}>
                        <Plus size={18} />
                        Novo Candidato
                    </GovButton>
                </div>

                {/* Filter */}
                {categoriasUnicas.length > 0 && (
                    <Card padding="md" className="mb-6">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-700 font-medium">Filtrar por categoria:</span>
                            <select
                                value={selectedCategoria}
                                onChange={(e) => setSelectedCategoria(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1351B4] focus:border-transparent outline-none"
                            >
                                <option value="">Todas as categorias</option>
                                {categoriasUnicas.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </Card>
                )}

                {loading ? (
                    <Loading text="Carregando candidatos..." />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidatosFiltrados.map((item, index) => (
                            <Card key={index} hover padding="lg">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="px-3 py-1 bg-[#1351B4] text-white text-xs rounded">
                                            {item.categoriaNome}
                                        </div>
                                        <button
                                            onClick={() => setDeleteModalOpen({
                                                categoriaId: item.categoriaId,
                                                numero: item.candidato.numero,
                                                nome: item.candidato.nome
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
                                                {item.candidato.numero}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                                            {item.candidato.nome}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {item.candidato.partido}
                                        </p>
                                    </div>

                                    {item.candidato.foto && (
                                        <div className="mt-4 w-full h-40 bg-gray-200 rounded overflow-hidden">
                                            <img
                                                src={item.candidato.foto}
                                                alt={item.candidato.nome}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}

                        {candidatosFiltrados.length === 0 && (
                            <div className="col-span-full">
                                <Card padding="lg">
                                    <div className="text-center py-12">
                                        <User className="mx-auto text-gray-400 mb-4" size={64} />
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                            {selectedCategoria ? 'Nenhum candidato nesta categoria' : 'Nenhum candidato cadastrado'}
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
                    title="Confirmar Exclusão"
                    message={`Tem certeza que deseja excluir o candidato "${deleteModalOpen.nome}" (${deleteModalOpen.numero})? Esta ação não pode ser desfeita.`}
                    confirmText="Deletar"
                    cancelText="Cancelar"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteModalOpen(null)}
                />
            )}
        </Layout>
    );
};
