import React from 'react';

interface StatusBadgeProps {
    status: 'ativa' | 'futura' | 'encerrada';
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    const styles = {
        ativa: 'bg-green-100 text-green-800 border-green-200',
        futura: 'bg-blue-100 text-blue-800 border-blue-200',
        encerrada: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
        ativa: 'Em andamento',
        futura: 'Em breve',
        encerrada: 'Encerrada'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]} ${className}`}>
            {labels[status]}
        </span>
    );
};
