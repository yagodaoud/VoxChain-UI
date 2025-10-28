import React, { useEffect, useState } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: string;
    showAnimation?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    confirmButtonColor = 'bg-red-500 hover:bg-red-600',
    showAnimation = true
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showIcon, setShowIcon] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            if (showAnimation) {
                setTimeout(() => setShowIcon(true), 300);
            } else {
                setShowIcon(true);
            }
        } else {
            setIsVisible(false);
            setShowIcon(false);
        }
    }, [isOpen, showAnimation]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${isVisible ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`
                relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300
                ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
            `}>
                <div className="p-8 text-center">
                    {/* Warning Icon */}
                    <div className="mb-6">
                        <div className={`
                            mx-auto w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center
                            transition-all duration-500 ${showIcon ? 'scale-100' : 'scale-0'}
                        `}>
                            <svg
                                className="w-10 h-10 text-orange-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        {title}
                    </h2>

                    {/* Message */}
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonColor}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
