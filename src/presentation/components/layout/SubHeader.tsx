import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SubHeaderProps {
    className?: string;
}

export const SubHeader: React.FC<SubHeaderProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Função para verificar se o botão está ativo
    const isActive = (path: string) => {
        if (path === '/eleicoes') {
            return location.pathname === '/eleicoes';
        }
        if (path === '/meus-votos') {
            return location.pathname === '/meus-votos';
        }
        return false;
    };

    // Função para obter as classes CSS do botão
    const getButtonClasses = (path: string) => {
        const baseClasses = "px-6 py-3 rounded font-medium transition-all duration-200 flex items-center justify-center gap-2";
        const activeClasses = "bg-[#0c3d8a] text-white font-semibold ring-2 ring-white ring-opacity-50";
        const inactiveClasses = "bg-[#1351B4] hover:bg-[#0c3d8a] text-white";

        return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
    };

    return (
        <div className={`bg-transparent py-2 mt-3 ${className}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/eleicoes')}
                        className={getButtonClasses('/eleicoes')}
                    >
                        Eleições
                    </button>
                    <button
                        onClick={() => navigate('/meus-votos')}
                        className={getButtonClasses('/meus-votos')}
                    >
                        Meus Votos
                    </button>
                </div>
            </div>
        </div>
    );
};
