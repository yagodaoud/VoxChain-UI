import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout, GovButton, Input, FormCard, AdminSubHeader, ElectionSuccessModal } from '../../../components';
import { MultiSelectDropdown, DateTimeBRInput, parseDateTimeBR } from '../../../components/forms';
import { ApiService } from '../../../../data/api/ApiService';
import type { Eleicao } from '../../../../domain/eleicao';
import type { Categoria } from '../../../../domain/categoria';
import { CategoriaEleicao } from '../../../../domain/categoria';

export const CriarEleicaoPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const api = new ApiService();
    const isEdit = Boolean(id);

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataInicioBr, setDataInicioBr] = useState('');
    const [dataFimBr, setDataFimBr] = useState('');
    const [loading, setLoading] = useState(false);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const parsedInicio = parseDateTimeBR(dataInicioBr);
            const parsedFim = parseDateTimeBR(dataFimBr);
            if (!parsedInicio || !parsedFim) {
                throw new Error('Datas inválidas');
            }
            const novaEleicao: Eleicao = {
                id: id || Date.now().toString(),
                nome,
                descricao,
                dataInicio: parsedInicio,
                dataFim: parsedFim,
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

    const onSelecionarCategorias = (values: string[]) => {
        // Mapeia valores do enum para o modelo de domínio Categoria
        const mapToCategoria = (value: string): Categoria => ({
            id: `cat-${value}`,
            nome: value,
            candidatos: []
        });

        setCategorias(values.map(mapToCategoria));
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
                                <DateTimeBRInput
                                    label="Data de Início"
                                    value={dataInicioBr}
                                    onChange={setDataInicioBr}
                                    required
                                />

                                <DateTimeBRInput
                                    label="Data de Término"
                                    value={dataFimBr}
                                    onChange={setDataFimBr}
                                    required
                                />
                            </div>
                        </div>
                    </FormCard>

                    {/* Categorias */}
                    <FormCard title="Categorias" className="mt-6">
                        <div className="space-y-4">
                            <MultiSelectDropdown
                                label="Categorias da Eleição"
                                options={Object.values(CategoriaEleicao).map(v => ({ label: v.replace(/_/g, ' '), value: v }))}
                                selected={categorias.map(c => c.nome)}
                                onChange={onSelecionarCategorias}
                            />

                            {categorias.length === 0 && (
                                <p className="text-gray-500 text-center py-4">
                                    Selecione ao menos uma categoria
                                </p>
                            )}
                        </div>
                    </FormCard>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <GovButton
                            type="submit"
                            disabled={
                                loading ||
                                categorias.length === 0 ||
                                !parseDateTimeBR(dataInicioBr) ||
                                !parseDateTimeBR(dataFimBr)
                            }
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
