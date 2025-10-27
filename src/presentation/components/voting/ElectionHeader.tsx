import React from 'react';
import type { Eleicao } from '../../../domain/eleicao';

interface ElectionHeaderProps {
    eleicao: Eleicao;
    categoriaAtual: number;
}

export const ElectionHeader: React.FC<ElectionHeaderProps> = ({ eleicao, categoriaAtual }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{eleicao.nome}</h1>
                    <p className="text-gray-600 text-sm">{eleicao.descricao}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">
                        Categoria {categoriaAtual + 1} de {eleicao.categorias.length}
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-[#1351B4] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((categoriaAtual + 1) / eleicao.categorias.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
