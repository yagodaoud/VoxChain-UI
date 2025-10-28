import React from 'react';
import type { Candidato } from '../../../domain/candidato';

interface CandidateInfoProps {
    candidatoSelecionado: Candidato | null;
    numeroDigitado: string;
    votandoEmBranco: boolean;
}

export const CandidateInfo: React.FC<CandidateInfoProps> = ({ candidatoSelecionado, numeroDigitado, votandoEmBranco }) => {
    if (votandoEmBranco) {
        return (
            <div className="bg-white p-4 rounded-lg border-2 border-blue-500 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <p className="text-lg font-bold text-gray-800">VOTO EM BRANCO</p>
                </div>
                <p className="text-sm text-gray-600 ml-6">Você está votando em branco nesta categoria</p>
            </div>
        );
    }

    if (candidatoSelecionado) {
        return (
            <div className="bg-white p-4 rounded-lg border-2 border-green-500 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="text-lg font-bold text-gray-800">{candidatoSelecionado.nome}</p>
                </div>
                <p className="text-sm text-gray-600 ml-6">{candidatoSelecionado.partido}</p>
            </div>
        );
    }

    if (numeroDigitado.length === 2) {
        return (
            <div className="bg-white p-4 rounded-lg border-2 border-red-500 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <p className="text-lg font-bold text-red-600">NÚMERO INVÁLIDO</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <p className="text-lg font-bold text-gray-500">Digite o número do candidato</p>
            </div>
        </div>
    );
};
