import React from 'react';

interface BallotKeyboardProps {
    onDigito: (digito: string) => void;
    onCorrige: () => void;
    onConfirma: () => void;
    candidatoSelecionado: any;
    votando: boolean;
}

export const BallotKeyboard: React.FC<BallotKeyboardProps> = ({
    onDigito,
    onCorrige,
    onConfirma,
    candidatoSelecionado,
    votando
}) => {
    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6">
            <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => (
                    <button
                        key={n}
                        onClick={() => onDigito(n.toString())}
                        className="bg-gray-700 text-white text-2xl font-bold py-4 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        {n}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
                <button
                    onClick={onCorrige}
                    className="bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    CORRIGE
                </button>
                <button className="bg-gray-600 text-white font-bold py-3 rounded-lg opacity-50 cursor-not-allowed shadow-lg">
                    BRANCO
                </button>
                <button
                    onClick={onConfirma}
                    disabled={!candidatoSelecionado || votando}
                    className="bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                    {votando ? 'VOTANDO...' : 'CONFIRMA'}
                </button>
            </div>
        </div>
    );
};
