import React from 'react';
import { Card } from './Card';

interface StatCardProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconBgClassName: string;
    value: React.ReactNode;
    label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, iconBgClassName, value, label }) => {
    return (
        <Card padding="lg">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${iconBgClassName} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                </div>
                <div>
                    <div className="text-2xl font-bold text-gray-800">{value}</div>
                    <div className="text-sm text-gray-600">{label}</div>
                </div>
            </div>
        </Card>
    );
};


