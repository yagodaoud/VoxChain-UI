import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    action,
    className = ''
}) => {
    return (
        <div className={`bg-white rounded-lg p-12 text-center ${className}`}>
            <Icon size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
            {description && <p className="text-gray-600 mb-4">{description}</p>}
            {action && <div>{action}</div>}
        </div>
    );
};
