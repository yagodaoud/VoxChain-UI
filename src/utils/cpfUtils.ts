export const formatCPF = (value: string, previousValue: string = ''): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
        return numbers
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return previousValue;
};


