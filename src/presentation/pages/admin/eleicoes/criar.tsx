import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout, GovButton, Input, FormCard, AdminSubHeader, ElectionSuccessModal } from '../../../components';
import { MockApiService } from '../../../../data/api/MockApiService';
import type { Eleicao } from '../../../../domain/eleicao';
import type { Categoria } from '../../../../domain/categoria';

export const CriarEleicaoPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const api = new MockApiService();
    const isEdit = Boolean(id);

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [loading, setLoading] = useState(false);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaNome, setCategoriaNome] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const novaEleicao: Eleicao = {
                id: id || Date.now().toString(),
                nome,
                descricao,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                categorias,
                status: 'futura'
            };

            if (isEdit) {
                await api.atualizarEleicao(id!, novaEleicao);
                navigate('/admin/eleicoes');
            } else {
                await api.criarEleicao(novaEleicao);
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Erro ao salvar eleição:', error);
            alert('Erro ao salvar eleição');
        } finally {
            setLoading(false);
        }
    };

    const adicionarCategoria = () => {
        if (!categoriaNome.trim()) return;

        const novaCategoria: Categoria = {
            id: Date.now().toString(),
            nome: categoriaNome.trim(),
            candidatos: []
        };

        setCategorias([...categorias, novaCategoria]);
        setCategoriaNome('');
    };

    const removerCategoria = (id: string) => {
        setCategorias(categorias.filter(cat => cat.id !== id));
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        navigate('/admin/eleicoes');
    };

    return (
        <Layout className="bg-[#F8F9FA]">
            <AdminSubHeader />
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <GovButton
                        onClick={() => navigate('/admin/eleicoes')}
                        variant="secondary"
                        className="mb-6"
                    >
                        <ArrowLeft size={18} />
                        Voltar para Eleições
                    </GovButton>
                    <h1 className="text-4xl font-bold text-gray-800">
                        {isEdit ? 'Editar Eleição' : 'Nova Eleição'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Preencha os dados abaixo para {isEdit ? 'editar' : 'criar'} a eleição
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <FormCard title="Informações Básicas">
                        <div className="space-y-6">
                            <Input
                                label="Nome da Eleição"
                                value={nome}
                                onChange={setNome}
                                placeholder="Ex: Eleições Gerais 2025"
                                required
                            />

                            <Input
                                label="Descrição"
                                value={descricao}
                                onChange={setDescricao}
                                placeholder="Descrição detalhada da eleição"
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Data de Início"
                                    type="datetime-local"
                                    value={dataInicio}
                                    onChange={setDataInicio}
                                    required
                                />

                                <Input
                                    label="Data de Término"
                                    type="datetime-local"
                                    value={dataFim}
                                    onChange={setDataFim}
                                    required
                                />
                            </div>
                        </div>
                    </FormCard>

                    {/* Categorias */}
                    <FormCard title="Categorias" className="mt-6">
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <Input
                                    label="Nome da Categoria"
                                    value={categoriaNome}
                                    onChange={setCategoriaNome}
                                    placeholder="Ex: Presidente, Governador, Prefeito"
                                />
                                <GovButton
                                    type="button"
                                    onClick={adicionarCategoria}
                                    variant="secondary"
                                    className="self-end"
                                >
                                    Adicionar
                                </GovButton>
                            </div>

                            <div className="space-y-2">
                                {categorias.map(categoria => (
                                    <div
                                        key={categoria.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                                    >
                                        <span className="text-gray-800">{categoria.nome}</span>
                                        <GovButton
                                            type="button"
                                            onClick={() => removerCategoria(categoria.id)}
                                            variant="secondary"
                                            className="text-red-600"
                                        >
                                            Remover
                                        </GovButton>
                                    </div>
                                ))}
                            </div>

                            {categorias.length === 0 && (
                                <p className="text-gray-500 text-center py-4">
                                    Adicione categorias para esta eleição
                                </p>
                            )}
                        </div>
                    </FormCard>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <GovButton
                            type="submit"
                            disabled={loading || categorias.length === 0}
                            fullWidth
                        >
                            {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Eleição'}
                        </GovButton>
                        <GovButton
                            type="button"
                            onClick={() => navigate('/admin/eleicoes')}
                            variant="secondary"
                            fullWidth
                        >
                            Cancelar
                        </GovButton>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            <ElectionSuccessModal
                isOpen={showSuccessModal}
                onClose={handleSuccessModalClose}
                eleicaoNome={nome}
                onConfirm={handleSuccessModalClose}
            />
        </Layout>
    );
};
