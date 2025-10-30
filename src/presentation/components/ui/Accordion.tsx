import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    isOpen?: boolean; // controlled
    defaultOpen?: boolean; // uncontrolled
    onToggle?: (open: boolean) => void;
    className?: string;
    children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
    title,
    subtitle,
    isOpen,
    defaultOpen = false,
    onToggle,
    className,
    children
}) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = typeof isOpen === 'boolean' ? isOpen : internalOpen;
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState<string>('0px');

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        // Measure and animate height for smooth expand/collapse
        if (open) {
            const height = el.scrollHeight;
            setMaxHeight(height + 'px');
            // After transition completes, set to 'none' to allow dynamic content growth
            const timeout = setTimeout(() => setMaxHeight('none'), 250);
            return () => clearTimeout(timeout);
        } else {
            // Set to measured height first to enable transition back to 0
            const height = el.scrollHeight;
            // Force reflow sequence for smooth transition when going to 0
            requestAnimationFrame(() => {
                setMaxHeight(height + 'px');
                requestAnimationFrame(() => setMaxHeight('0px'));
            });
        }
    }, [open]);

    const handleToggle = () => {
        if (typeof isOpen === 'boolean') {
            onToggle?.(!isOpen);
        } else {
            setInternalOpen(prev => {
                const next = !prev;
                onToggle?.(next);
                return next;
            });
        }
    };

    return (
        <div className={className}>
            <button
                className="w-full flex items-center justify-between"
                onClick={handleToggle}
                aria-expanded={open}
            >
                <div className="text-left">
                    <div className="text-xl font-bold text-gray-800">{title}</div>
                    {subtitle && <div className="text-gray-600 text-sm">{subtitle}</div>}
                </div>
                {open ? <ChevronUp /> : <ChevronDown />}
            </button>
            <div
                ref={contentRef}
                style={{ maxHeight, overflow: 'hidden', transition: 'max-height 250ms ease-in-out' }}
                aria-hidden={!open}
            >
                <div className={`pt-6 ${open ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}> 
                    {children}
                </div>
            </div>
        </div>
    );
};


