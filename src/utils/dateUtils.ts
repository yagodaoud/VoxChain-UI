/**
 * Utilitários para formatação de datas no padrão brasileiro
 */

/**
 * Formata uma data para o padrão brasileiro (dd/mm/aaaa)
 * @param date - Data a ser formatada
 * @returns String formatada no padrão brasileiro
 */
export const formatarDataBrasileira = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Formata uma data com hora para o padrão brasileiro (dd/mm/aaaa hh:mm)
 * @param date - Data a ser formatada
 * @returns String formatada no padrão brasileiro com hora
 */
export const formatarDataHoraBrasileira = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Formata apenas a hora no padrão brasileiro (hh:mm)
 * @param date - Data a ser formatada
 * @returns String formatada apenas com hora
 */
export const formatarHoraBrasileira = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};
