import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    const { usuario, logout } = useAuth();


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
