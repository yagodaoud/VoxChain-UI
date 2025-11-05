import React, { useEffect, useState } from 'react';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    showAnimation?: boolean;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
    isOpen,
    onClose,
    title = 'Erro',
    message,
    confirmText = 'OK',
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
                    {/* Error Icon */}
                    <div className="mb-6">
                        <div className={`
                            mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center
                            transition-all duration-500 ${showIcon ? 'scale-100' : 'scale-0'}
                        `}>
                            <svg
                                className="w-10 h-10 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
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

                    {/* Action Button */}
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

