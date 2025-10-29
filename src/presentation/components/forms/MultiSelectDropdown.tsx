import React, { useEffect, useMemo, useRef, useState } from 'react';

type Option = { label: string; value: string };

interface MultiSelectDropdownProps {
    label?: string;
    placeholder?: string;
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    className?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    label,
    placeholder = 'Selecione...',
    options,
    selected,
    onChange,
    className
}) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const selectedOptions = useMemo(
        () => options.filter(opt => selected.includes(opt.value)),
        [options, selected]
    );

    const toggleValue = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter(v => v !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const removeValue = (value: string) => {
        onChange(selected.filter(v => v !== value));
    };

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    return (
        <div className={className} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            )}
            <div
                className={`w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#1351B4] focus-within:border-[#1351B4] transition`}
            >
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    className="w-full text-left flex items-center justify-between"
                >
                    <div className="flex gap-2 flex-wrap">
                        {selectedOptions.length === 0 ? (
                            <span className="text-gray-400">{placeholder}</span>
                        ) : (
                            selectedOptions.map(opt => (
                                <span
                                    key={opt.value}
                                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
                                >
                                    {opt.label}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeValue(opt.value); }}
                                        className="text-gray-500 hover:text-gray-700"
                                        aria-label={`Remover ${opt.label}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))
                        )}
                    </div>
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {open && (
                <div className="mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto z-10">
                    <ul className="py-1">
                        {options.map(opt => {
                            const active = selected.includes(opt.value);
                            return (
                                <li key={opt.value}>
                                    <button
                                        type="button"
                                        onClick={() => toggleValue(opt.value)}
                                        className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50 ${active ? 'bg-gray-50' : ''}`}
                                    >
                                        <span
                                            className={`inline-flex items-center justify-center w-4 h-4 border rounded-sm ${active ? 'bg-[#1351B4] border-[#1351B4]' : 'border-gray-300'}`}
                                        >
                                            {active && (
                                                <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3-3a1 1 0 011.42-1.42L8 12.09l6.79-6.8a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </span>
                                        <span className="text-gray-800">{opt.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};


