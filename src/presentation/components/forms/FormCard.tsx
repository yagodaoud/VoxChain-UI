import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface FormCardProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    className?: string;
}

export const FormCard: React.FC<FormCardProps> = ({
    children,
    title,
    subtitle,
    icon: Icon,
    className = ''
}) => {
    return (
        <Card className={`shadow-lg ${className}`}>
            <div className="text-center mb-8">
                {Icon && (
                    <div className="w-20 h-20 bg-[#1351B4] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="text-white" size={40} />
                    </div>
                )}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
                {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
            </div>
            {children}
        </Card>
    );
};
