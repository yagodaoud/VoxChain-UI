import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { GovButton } from '../ui';

interface HeaderProps {
    showUserActions?: boolean;
    showBackButton?: boolean;
    backPath?: string;
    backLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
    showUserActions = true,
    showBackButton = false,
    backPath = '/',
    backLabel = 'Voltar para home'
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario, logout } = useAuth();

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
        const baseClasses = "px-4 py-2 rounded transition text-sm";
        const activeClasses = "bg-[#1351B4] text-white font-semibold ring-2 ring-white ring-opacity-50";
        const inactiveClasses = "bg-[#1351B4] hover:bg-[#0c3d8a] text-white";

        return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
    };

    return (
        <header className="bg-[#071D41] text-white">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <button
                    onClick={() => navigate(backPath)}
                    className="flex items-center gap-3 hover:opacity-80 transition"
                >
                    <div className="w-10 h-10 bg-[#1351B4] rounded flex items-center justify-center font-bold text-xl">
                        V
                    </div>
                    <div className="text-left">
                        <div className="font-bold text-lg">VoxChain</div>
                        <div className="text-xs text-gray-300">
                            {showBackButton ? backLabel : 'Sistema de Votação em Blockchain'}
                        </div>
                    </div>
                </button>

                {showUserActions && (
                    <div className="flex items-center gap-3">
                        {usuario ? (
                            <>
                                <div className="text-sm text-gray-200 hidden sm:block">
                                    Olá, {usuario.nome}
                                </div>
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
                                <button
                                    onClick={() => { logout(); navigate('/'); }}
                                    className="px-4 py-2 bg-white text-[#071D41] rounded hover:bg-gray-100 transition text-sm"
                                >
                                    Sair
                                </button>
                            </>
                        ) : (
                            <GovButton onClick={() => navigate('/login')}>
                                <User size={18} />
                                Entrar com gov.br
                            </GovButton>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};
