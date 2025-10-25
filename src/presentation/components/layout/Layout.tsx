import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
    showUserActions?: boolean;
    showBackButton?: boolean;
    backPath?: string;
    backLabel?: string;
    className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    showHeader = true,
    showFooter = true,
    showUserActions = true,
    showBackButton = false,
    backPath = '/',
    backLabel = 'Voltar para home',
    className = ''
}) => {
    return (
        <div className={`min-h-screen bg-white flex flex-col ${className}`}>
            {showHeader && (
                <Header
                    showUserActions={showUserActions}
                    showBackButton={showBackButton}
                    backPath={backPath}
                    backLabel={backLabel}
                />
            )}

            {/* Barra azul */}
            <div className="bg-[#1351B4] h-2"></div>

            {/* Conteúdo principal - flex-1 faz com que ocupe todo o espaço disponível */}
            <div className="flex-1">
                {children}
            </div>

            {showFooter && <Footer />}
        </div>
    );
};
