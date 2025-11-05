import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout, GovButton, Input, FormCard, AdminSubHeader, SuccessModal, ErrorModal } from '../../../components';
import { ApiService } from '../../../../data/api/ApiService';
import type { Eleitor } from '../../../../domain/eleitor';
import { formatCPF } from '../../../../utils/cpfUtils';
import { getErrorMessage } from '../../../../utils/errorUtils';

export const CriarEleitorPage: React.FC = () => {
    const navigate = useNavigate();
    const { cpfHash } = useParams();
    const api = new ApiService();
    const isEdit = Boolean(cpfHash);

    const [cpf, setCpf] = useState('');
    const [zona, setZona] = useState('');
    const [secao, setSecao] = useState('');
    const [senha, setSenha] = useState('');
    const [saving, setSaving] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const carregar = async () => {
            if (!isEdit || !cpfHash) return;
            setLoadingEdit(true);
            try {
                const lista = await api.listarEleitores();
                const existente = lista.find(e => e.cpfHash === cpfHash);
                if (!existente) {
                    setErrorMessage('Eleitor não encontrado');
                    setShowErrorModal(true);
                    setTimeout(() => {
                        navigate('/admin/eleitores');
                    }, 2000);
                    return;
                }
                setCpf('');
                setZona(String(existente.zona));
                setSecao(String(existente.secao));
            } catch (e) {
                console.error('Erro ao carregar eleitor:', e);
                const errorMsg = getErrorMessage(e, 'Erro ao carregar eleitor');
                setErrorMessage(errorMsg);
                setShowErrorModal(true);
                setTimeout(() => {
                    navigate('/admin/eleitores');
                }, 2000);
            } finally {
                setLoadingEdit(false);
            }
        };
        carregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, cpfHash]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            let payload: Eleitor & { senha?: string } | { cpf: string, zona: number, secao: number, senha?: string };
            if (isEdit && cpfHash) {
                payload = {
                    cpfHash,
                    zona: Number(zona),
                    secao: Number(secao)
                };
                await api.atualizarEleitor(payload);
            } else {
                const onlyDigitsCpf = cpf.replace(/\D/g, '');
                payload = {
                    cpf: onlyDigitsCpf,
                    zona: Number(zona),
                    secao: Number(secao),
                    senha
                };
                await api.criarEleitor(payload);
            }
            setShowSuccess(true);
        } catch (error) {
            console.error('Erro ao salvar eleitor:', error);
            const errorMsg = getErrorMessage(error, 'Erro ao salvar eleitor');
            setErrorMessage(errorMsg);
            setShowErrorModal(true);
        } finally {
            setSaving(false);
        }
    };

    const closeSuccess = () => {
        setShowSuccess(false);
        navigate('/admin/eleitores');
    };

    return (
        <Layout className="bg-[#F8F9FA]">
            <AdminSubHeader />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <GovButton
                        onClick={() => navigate('/admin/eleitores')}
                        variant="secondary"
                        className="mb-6"
                    >
                        <ArrowLeft size={18} />
                        Voltar para Eleitores
                    </GovButton>
                    <h1 className="text-4xl font-bold text-gray-800">{isEdit ? 'Editar Eleitor' : 'Novo Eleitor'}</h1>
                    <p className="text-gray-600 mt-2">Preencha os dados abaixo para {isEdit ? 'editar' : 'cadastrar'} o eleitor</p>
                </div>

                <form onSubmit={onSubmit}>
                    <FormCard title="Dados do Eleitor">
                        <div className="space-y-6">
                            {!isEdit && (
                                <Input
                                    label="CPF"
                                    value={cpf}
                                    onChange={(val) => setCpf(formatCPF(val, cpf))}
                                    placeholder="Digite o CPF do eleitor"
                                    required
                                />
                            )}
                            {!isEdit && (
                                <Input
                                    label="Senha"
                                    type="password"
                                    value={senha}
                                    onChange={setSenha}
                                    placeholder="Defina a senha do eleitor"
                                    required
                                />
                            )}
                            <Input
                                label="Zona"
                                type="number"
                                value={zona}
                                onChange={setZona}
                                placeholder="Ex: 123"
                                required
                            />
                            <Input
                                label="Seção"
                                type="number"
                                value={secao}
                                onChange={setSecao}
                                placeholder="Ex: 456"
                                required
                            />
                        </div>
                    </FormCard>

                    <div className="flex gap-3 mt-6">
                        <GovButton type="submit" disabled={saving || loadingEdit} fullWidth>
                            {saving ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Eleitor'}
                        </GovButton>
                        <GovButton type="button" onClick={() => navigate('/admin/eleitores')} variant="secondary" fullWidth>
                            Cancelar
                        </GovButton>
                    </div>
                </form>
            </div>

            <SuccessModal
                isOpen={showSuccess}
                onClose={closeSuccess}
                title={isEdit ? 'Eleitor atualizado com sucesso!' : 'Eleitor criado com sucesso!'}
                message="A operação foi concluída."
                onConfirm={closeSuccess}
            />

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Erro"
                message={errorMessage}
            />
        </Layout>
    );
};


