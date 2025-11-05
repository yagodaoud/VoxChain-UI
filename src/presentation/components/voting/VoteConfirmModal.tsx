import React, { useEffect, useState } from 'react';
import type { Candidato } from '../../../domain/candidato';

interface VoteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    candidato: Candidato | null;
    votandoEmBranco: boolean;
    categoriaNome: string;
    isUltimaCategoria: boolean;
}

export const VoteConfirmModal: React.FC<VoteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    candidato,
    votandoEmBranco,
    categoriaNome,
    isUltimaCategoria
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    isVisible ? 'opacity-50' : 'opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`
                    relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300
                    ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
                `}
            >
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Confirmar Voto
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {isUltimaCategoria 
                                ? 'Confirme seu voto para finalizar' 
                                : 'Confirme seu voto para prosseguir'}
                        </p>
                    </div>

                    {/* Categoria */}
                    <div className="mb-4 text-center">
                        <p className="text-sm text-gray-500 mb-1">Categoria</p>
                        <p className="text-lg font-semibold text-gray-800">{categoriaNome}</p>
                    </div>

                    {/* Conteúdo do Voto */}
                    {votandoEmBranco ? (
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center mb-6">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-xl font-bold">B</span>
                            </div>
                            <p className="text-xl font-bold text-gray-800 mb-2">VOTO EM BRANCO</p>
                            <p className="text-sm text-gray-600">Você está votando em branco nesta categoria</p>
                        </div>
                    ) : candidato ? (
                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                            <div className="flex flex-col items-center">
                                {/* Foto do Candidato */}
                                {candidato.fotoUrl ? (
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 mb-4 bg-white">
                                        <img 
                                            src={candidato.fotoUrl} 
                                            alt={candidato.nome}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Fallback se a imagem não carregar
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center border-4 border-green-600 mb-4">
                                        <span className="text-white text-4xl font-bold">
                                            {candidato.nome.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                
                                {/* Informações do Candidato */}
                                <div className="text-center">
                                    <div className="mb-2">
                                        <span className="text-3xl font-bold text-gray-800">{candidato.numero}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{candidato.nome}</h3>
                                    <p className="text-gray-600 text-sm">{candidato.partido}</p>
                                    {candidato.uf && (
                                        <p className="text-gray-500 text-xs mt-1">{candidato.uf}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Botões */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                        >
                            {isUltimaCategoria ? 'Confirmar e Finalizar' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

