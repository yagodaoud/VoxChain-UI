import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, subtitle, className = '' }) => {
    return (
        <div className={`mb-8 ${className}`}>
            <div className="flex items-center gap-3 mb-2">
                <Icon className="text-[#1351B4]" size={28} />
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            </div>
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
    );
};


