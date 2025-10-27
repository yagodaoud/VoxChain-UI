import React from 'react';
import type { Categoria } from '../../../domain/categoria';
import type { Candidato } from '../../../domain/candidato';
import { BallotDisplay } from './BallotDisplay';
import { BallotKeyboard } from './BallotKeyboard';

interface ElectronicBallotProps {
    categoria: Categoria | undefined;
    numeroDigitado: string;
    candidatoSelecionado: Candidato | null;
    onDigito: (digito: string) => void;
    onCorrige: () => void;
    onConfirma: () => void;
    votando: boolean;
}

export const ElectronicBallot: React.FC<ElectronicBallotProps> = ({
    categoria,
    numeroDigitado,
    candidatoSelecionado,
    onDigito,
    onCorrige,
    onConfirma,
    votando
}) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-gray-300">
            <BallotDisplay
                categoria={categoria}
                numeroDigitado={numeroDigitado}
                candidatoSelecionado={candidatoSelecionado}
            />
            <BallotKeyboard
                onDigito={onDigito}
                onCorrige={onCorrige}
                onConfirma={onConfirma}
                candidatoSelecionado={candidatoSelecionado}
                votando={votando}
            />
        </div>
    );
};
