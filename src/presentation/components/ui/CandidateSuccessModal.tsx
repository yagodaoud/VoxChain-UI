import React from 'react';
import { SuccessModal } from './SuccessModal';

interface CandidateSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidatoNome?: string;
    onConfirm?: () => void;
}

export const CandidateSuccessModal: React.FC<CandidateSuccessModalProps> = ({
    isOpen,
    onClose,
    candidatoNome,
    onConfirm
}) => {
    const title = "Candidato Criado com Sucesso!";
    const message = candidatoNome
        ? `O candidato "${candidatoNome}" foi cadastrado com sucesso e está disponível para votação.`
        : "O candidato foi cadastrado com sucesso e está disponível para votação.";

    return (
        <SuccessModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            message={message}
            confirmText="Ver Candidatos"
            showAnimation={true}
            onConfirm={onConfirm}
        />
    );
};
