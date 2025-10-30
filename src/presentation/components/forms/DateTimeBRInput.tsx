import React from 'react';

interface DateTimeBRInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
}

// Aceita e exibe "dd/MM/yyyy HH:mm"
export const DateTimeBRInput: React.FC<DateTimeBRInputProps> = ({
    label,
    value,
    onChange,
    placeholder = 'dd/mm/aaaa hh:mm',
    required,
    className,
    disabled = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        // Normaliza: mantém somente dígitos e separadores esperados; limita tamanho
        const cleaned = raw.replace(/[^0-9/:\s]/g, '').slice(0, 16);
        onChange(formatAsMask(cleaned));
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            )}
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-[#1351B4]"
                inputMode="numeric"
                aria-label={label}
            />
        </div>
    );
};

function formatAsMask(input: string): string {
    // Aplica máscara incremental: dd/MM/yyyy HH:mm
    const digits = input.replace(/[^0-9]/g, '');
    const parts: string[] = [];

    if (digits.length <= 2) return digits;
    parts.push(digits.slice(0, 2));

    if (digits.length <= 4) return parts[0] + '/' + digits.slice(2);
    parts.push(digits.slice(2, 4));

    if (digits.length <= 8) return parts[0] + '/' + parts[1] + '/' + digits.slice(4);
    parts.push(digits.slice(4, 8));

    if (digits.length <= 10)
        return parts[0] + '/' + parts[1] + '/' + parts[2] + ' ' + digits.slice(8);

    const hh = digits.slice(8, 10);
    if (digits.length <= 12)
        return parts[0] + '/' + parts[1] + '/' + parts[2] + ' ' + hh + ':' + digits.slice(10);

    const mm = digits.slice(10, 12);
    return parts[0] + '/' + parts[1] + '/' + parts[2] + ' ' + hh + ':' + mm;
}

export function parseDateTimeBR(value: string): Date | null {
    const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
    if (!m) return null;
    const [_, dd, MM, yyyy, HH, mm] = m;
    const day = Number(dd);
    const month = Number(MM) - 1;
    const year = Number(yyyy);
    const hour = Number(HH);
    const minute = Number(mm);

    const d = new Date(year, month, day, hour, minute, 0, 0);
    // Validação simples para evitar datas inválidas (ex.: 32/13)
    if (
        d.getFullYear() !== year ||
        d.getMonth() !== month ||
        d.getDate() !== day ||
        d.getHours() !== hour ||
        d.getMinutes() !== minute
    ) {
        return null;
    }
    return d;
}


