import React from 'react';
import type { Categoria } from '../../../domain/categoria';
import type { Candidato } from '../../../domain/candidato';
import { CandidateInfo } from './CandidateInfo';

interface BallotDisplayProps {
    categoria: Categoria | undefined;
    numeroDigitado: string;
    candidatoSelecionado: Candidato | null;
    votandoEmBranco: boolean;
}

export const BallotDisplay: React.FC<BallotDisplayProps> = ({
    categoria,
    numeroDigitado,
    candidatoSelecionado,
    votandoEmBranco
}) => {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 h-[320px] flex flex-col">
            <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{categoria?.nome}</h2>
                <p className="text-sm text-gray-600">
                    {votandoEmBranco ? 'Voto em branco selecionado' : 'Digite o número do candidato'}
                </p>
            </div>

            {/* Display do número */}
            {votandoEmBranco ? (
                <div className="flex justify-center mb-6">
                    <div className="bg-white border-4 border-gray-800 rounded-lg px-6 py-4 shadow-inner">
                        <div className="text-3xl font-bold text-gray-800 text-center">BRANCO</div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center gap-4 mb-6">
                    <div className="w-20 h-24 bg-white border-4 border-gray-800 rounded-lg flex items-center justify-center text-5xl font-bold text-gray-800 shadow-inner">
                        {numeroDigitado[0] || '_'}
                    </div>
                    <div className="w-20 h-24 bg-white border-4 border-gray-800 rounded-lg flex items-center justify-center text-5xl font-bold text-gray-800 shadow-inner">
                        {numeroDigitado[1] || '_'}
                    </div>
                </div>
            )}

            {/* Info do Candidato */}
            <CandidateInfo
                candidatoSelecionado={candidatoSelecionado}
                numeroDigitado={numeroDigitado}
                votandoEmBranco={votandoEmBranco}
            />
        </div>
    );
};
