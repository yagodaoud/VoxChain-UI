import React from 'react';
import { SuccessModal } from './SuccessModal';

interface ElectionSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    eleicaoNome?: string;
    onConfirm?: () => void;
}

export const ElectionSuccessModal: React.FC<ElectionSuccessModalProps> = ({
    isOpen,
    onClose,
    eleicaoNome,
    onConfirm
}) => {
    const title = "Eleição Criada com Sucesso!";
    const message = eleicaoNome
        ? `A eleição "${eleicaoNome}" foi criada com sucesso e está disponível para gerenciamento.`
        : "A eleição foi criada com sucesso e está disponível para gerenciamento.";

    return (
        <SuccessModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            message={message}
            confirmText="Ver Eleições"
            showAnimation={true}
            onConfirm={onConfirm}
        />
    );
};
