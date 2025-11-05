import React from 'react';
import { Shield, Clock } from 'lucide-react';
import { GovButton, Card } from '../ui';

interface TokenConfirmationProps {
    tokenValidoAte: number;
    onContinuar: () => void;
}

export const TokenConfirmation: React.FC<TokenConfirmationProps> = ({ tokenValidoAte, onContinuar }) => {
    const tempoRestante = Math.floor((tokenValidoAte - Date.now()) / 1000 / 60);

    return (
        <Card className="max-w-md mx-auto text-center" padding="lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Token Gerado com Sucesso</h2>
            <p className="text-gray-600 mb-6">
                Você tem <strong>{tempoRestante} minutos</strong> para concluir sua votação de forma anônima.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <Clock size={18} />
                    <span className="font-semibold">Importante</span>
                </div>
                <p className="text-sm text-yellow-700">
                    Após iniciar, complete sua votação. Se sair, precisará gerar um novo token.
                </p>
            </div>
            <GovButton onClick={onContinuar} fullWidth>
                Iniciar Votação
            </GovButton>
        </Card>
    );
};

