import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminSubHeaderProps {
    className?: string;
}

export const AdminSubHeader: React.FC<AdminSubHeaderProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Função para verificar se o botão está ativo
    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
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
                        onClick={() => navigate('/admin')}
                        className={getButtonClasses('/admin')}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/admin/eleicoes')}
                        className={getButtonClasses('/admin/eleicoes')}
                    >
                        Eleições
                    </button>
                    <button
                        onClick={() => navigate('/admin/candidatos')}
                        className={getButtonClasses('/admin/candidatos')}
                    >
                        Candidatos
                    </button>
                </div>
            </div>
        </div>
    );
};

