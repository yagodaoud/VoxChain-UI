import React from 'react';

interface BallotKeyboardProps {
    onDigito: (digito: string) => void;
    onCorrige: () => void;
    onConfirma: () => void;
    onBranco: () => void;
    votando: boolean;
    isUltimaCategoria: boolean;
    canConfirm: boolean;
}

export const BallotKeyboard: React.FC<BallotKeyboardProps> = ({
    onDigito,
    onCorrige,
    onConfirma,
    onBranco,
    votando,
    isUltimaCategoria,
    canConfirm
}) => {
    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6">
            <div className="grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <button
                        key={n}
                        onClick={() => onDigito(n.toString())}
                        disabled={votando}
                        className={`bg-gray-700 text-white text-2xl font-bold py-4 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${votando ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {n}
                    </button>
                ))}
                <div></div>
                <button
                    onClick={() => onDigito('0')}
                    disabled={votando}
                    className={`bg-gray-700 text-white text-2xl font-bold py-4 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${votando ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    0
                </button>
                <div></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <button
                    onClick={onCorrige}
                    disabled={votando}
                    className={`bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${votando ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    CORRIGE
                </button>
                <button
                    onClick={onBranco}
                    disabled={votando}
                    className={`bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${votando ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    BRANCO
                </button>
                <button
                    onClick={onConfirma}
                    disabled={votando || !canConfirm}
                    className={`${votando && isUltimaCategoria ? 'bg-green-600' : 'bg-green-500'} text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${votando || !canConfirm ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                    {votando && isUltimaCategoria ? 'VOTANDO...' : 'CONFIRMA'}
                </button>
            </div>
        </div>
    );
};
