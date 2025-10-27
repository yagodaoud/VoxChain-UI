import React from 'react';
import { SuccessModal } from './SuccessModal';

interface VotingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    eleicaoNome?: string;
    onConfirm?: () => void;
}

export const VotingSuccessModal: React.FC<VotingSuccessModalProps> = ({
    isOpen,
    onClose,
    eleicaoNome,
    onConfirm
}) => {
    const title = "Votação Concluída!";
    const message = eleicaoNome
        ? `Sua votação na eleição "${eleicaoNome}" foi registrada com sucesso. Obrigado por participar na democracia digital!`
        : "Sua votação foi registrada com sucesso. Obrigado por participar na democracia digital!";

    return (
        <SuccessModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            message={message}
            confirmText="Voltar às Eleições"
            showAnimation={true}
            onConfirm={onConfirm}
        />
    );
};
