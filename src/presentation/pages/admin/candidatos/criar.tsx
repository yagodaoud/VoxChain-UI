import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout, GovButton, Input, FormCard, AdminSubHeader, CandidateSuccessModal } from '../../../components';
import { MockApiService } from '../../../../data/api/MockApiService';
import type { Candidato } from '../../../../domain/candidato';
import type { Eleicao } from '../../../../domain/eleicao';

export const CriarCandidatoPage: React.FC = () => {
    const navigate = useNavigate();
    const api = new MockApiService();

    const [eleicoes, setEleicoes] = useState<Eleicao[]>([]);
    const [loading, setLoading] = useState(true);
    const [numero, setNumero] = useState('');
    const [nome, setNome] = useState('');
    const [partido, setPartido] = useState('');
    const [foto, setFoto] = useState('');
    const [eleicaoSelecionada, setEleicaoSelecionada] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
    const [saving, setSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        loadEleicoes();
    }, []);

    const loadEleicoes = async () => {
        try {
            const data = await api.buscarEleicoes();
            setEleicoes(data);
        } catch (error) {
            console.error('Erro ao carregar eleições:', error);
        } finally {
            setLoading(false);
        }
    };

    const eleicaoEscolhida = eleicoes.find(e => e.id === eleicaoSelecionada);
    const categoriasDisponiveis = eleicaoEscolhida?.categorias || [];

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        navigate('/admin/candidatos');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!categoriaSelecionada) {
            alert('Selecione uma categoria');
            return;
        }

        setSaving(true);

        try {
            const novoCandidato: Candidato = {
                numero,
                nome,
                partido,
                foto: foto || undefined
            };

            await api.criarCandidato(categoriaSelecionada, novoCandidato);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Erro ao salvar candidato:', error);
            alert('Erro ao salvar candidato');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout className="bg-[#F8F9FA]">
                <AdminSubHeader />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">Carregando eleições...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout className="bg-[#F8F9FA]">
            <AdminSubHeader />
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <GovButton
                        onClick={() => navigate('/admin/candidatos')}
                        variant="secondary"
                        className="mb-6"
                    >
                        <ArrowLeft size={18} />
                        Voltar para Candidatos
                    </GovButton>
                    <h1 className="text-4xl font-bold text-gray-800">Novo Candidato</h1>
                    <p className="text-gray-600 mt-2">
                        Preencha os dados abaixo para cadastrar um novo candidato
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <FormCard title="Informações da Eleição e Categoria">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selecionar Eleição
                                </label>
                                <select
                                    value={eleicaoSelecionada}
                                    onChange={(e) => {
                                        setEleicaoSelecionada(e.target.value);
                                        setCategoriaSelecionada('');
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1351B4] focus:border-transparent outline-none"
                                    required
                                >
                                    <option value="">Selecione uma eleição</option>
                                    {eleicoes.map(eleicao => (
                                        <option key={eleicao.id} value={eleicao.id}>
                                            {eleicao.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selecionar Categoria
                                </label>
                                <select
                                    value={categoriaSelecionada}
                                    onChange={(e) => setCategoriaSelecionada(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#1351B4] focus:border-transparent outline-none"
                                    required
                                    disabled={!eleicaoSelecionada}
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categoriasDisponiveis.map(categoria => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </FormCard>

                    <FormCard title="Informações do Candidato" className="mt-6">
                        <div className="space-y-6">
                            <Input
                                label="Número do Candidato"
                                value={numero}
                                onChange={setNumero}
                                placeholder="Ex: 13, 45, 22"
                                required
                            />

                            <Input
                                label="Nome Completo"
                                value={nome}
                                onChange={setNome}
                                placeholder="Digite o nome completo do candidato"
                                required
                            />

                            <Input
                                label="Partido"
                                value={partido}
                                onChange={setPartido}
                                placeholder="Ex: PT, PSDB, PL"
                                required
                            />

                            <Input
                                label="URL da Foto (opcional)"
                                value={foto}
                                onChange={setFoto}
                                placeholder="https://exemplo.com/foto.jpg"
                                type="url"
                            />
                        </div>
                    </FormCard>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <GovButton
                            type="submit"
                            disabled={saving}
                            fullWidth
                        >
                            {saving ? 'Salvando...' : 'Criar Candidato'}
                        </GovButton>
                        <GovButton
                            type="button"
                            onClick={() => navigate('/admin/candidatos')}
                            variant="secondary"
                            fullWidth
                        >
                            Cancelar
                        </GovButton>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            <CandidateSuccessModal
                isOpen={showSuccessModal}
                onClose={handleSuccessModalClose}
                candidatoNome={nome}
                onConfirm={handleSuccessModalClose}
            />
        </Layout>
    );
};
