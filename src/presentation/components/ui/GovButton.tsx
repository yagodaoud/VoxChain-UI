import React from 'react';

interface GovButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const GovButton: React.FC<GovButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    fullWidth = false,
    disabled = false,
    className = '',
    type = 'button'
}) => {
    const baseClasses = "px-6 py-3 rounded font-medium transition-all duration-200 flex items-center justify-center gap-2";
    const variantClasses = variant === 'primary'
        ? "bg-[#1351B4] text-white hover:bg-[#0c3d8a]"
        : "bg-white text-[#1351B4] border-2 border-[#1351B4] hover:bg-[#E6F1FF]";
    const widthClass = fullWidth ? "w-full" : "";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses} ${widthClass} ${disabledClasses} ${className}`}
        >
            {children}
        </button>
    );
};
