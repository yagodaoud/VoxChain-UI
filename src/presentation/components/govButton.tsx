import React, { useState, createContext, useContext, useEffect } from 'react';
import { Search, User, ChevronRight, Eye, EyeOff, Calendar, CheckCircle, Clock, FileText } from 'lucide-react';

export const GovButton: React.FC<{ children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary'; fullWidth?: boolean }> =
    ({ children, onClick, variant = 'primary', fullWidth = false }) => {
        const baseClasses = "px-6 py-3 rounded font-medium transition-all duration-200 flex items-center justify-center gap-2";
        const variantClasses = variant === 'primary'
            ? "bg-[#1351B4] text-white hover:bg-[#0c3d8a]"
            : "bg-white text-[#1351B4] border-2 border-[#1351B4] hover:bg-[#E6F1FF]";
        const widthClass = fullWidth ? "w-full" : "";

        return (
            <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${widthClass}`
            }>
                {children}
            </button>
        );
    };