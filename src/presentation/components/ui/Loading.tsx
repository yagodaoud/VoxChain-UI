import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    size = 'md',
    text = 'Carregando...',
    className = ''
}) => {
    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className={`text-center py-12 ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-[#1351B4] mx-auto ${sizeClasses[size]}`}></div>
            {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
    );
};
