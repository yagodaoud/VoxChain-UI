import React from 'react';
import type { Categoria } from '../../../domain/categoria';
import type { Candidato } from '../../../domain/candidato';
import { BallotDisplay } from './BallotDisplay';
import { BallotKeyboard } from './BallotKeyboard';

interface ElectronicBallotProps {
    categoria: Categoria | undefined;
    numeroDigitado: string;
    candidatoSelecionado: Candidato | null;
    votandoEmBranco: boolean;
    onDigito: (digito: string) => void;
    onCorrige: () => void;
    onConfirma: () => void;
    onBranco: () => void;
    votando: boolean;
    isUltimaCategoria: boolean;
    canConfirm: boolean;
}

export const ElectronicBallot: React.FC<ElectronicBallotProps> = ({
    categoria,
    numeroDigitado,
    candidatoSelecionado,
    votandoEmBranco,
    onDigito,
    onCorrige,
    onConfirma,
    onBranco,
    votando,
    isUltimaCategoria,
    canConfirm
}) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-gray-300">
            <BallotDisplay
                categoria={categoria}
                numeroDigitado={numeroDigitado}
                candidatoSelecionado={candidatoSelecionado}
                votandoEmBranco={votandoEmBranco}
            />
            <BallotKeyboard
                onDigito={onDigito}
                onCorrige={onCorrige}
                onConfirma={onConfirma}
                onBranco={onBranco}
                votando={votando}
                isUltimaCategoria={isUltimaCategoria}
                canConfirm={canConfirm}
            />
        </div>
    );
};
