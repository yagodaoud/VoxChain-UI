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

/**
 * Calcula o tempo restante até uma data específica
 * @param targetDate - Data alvo
 * @returns Objeto com anos, meses, dias, horas, minutos e segundos restantes
 */
export const calcularTempoRestante = (targetDate: Date): {
    anos: number;
    meses: number;
    dias: number;
    horas: number;
    minutos: number;
    segundos: number;
    total: number;
} => {
    const agora = new Date();
    const diferenca = targetDate.getTime() - agora.getTime();

    if (diferenca <= 0) {
        return { anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0, total: 0 };
    }

    // Calcular anos
    const anos = Math.floor(diferenca / (1000 * 60 * 60 * 24 * 365));
    const restoAnos = diferenca % (1000 * 60 * 60 * 24 * 365);

    // Calcular meses (aproximação de 30 dias por mês)
    const meses = Math.floor(restoAnos / (1000 * 60 * 60 * 24 * 30));
    const restoMeses = restoAnos % (1000 * 60 * 60 * 24 * 30);

    // Calcular dias
    const dias = Math.floor(restoMeses / (1000 * 60 * 60 * 24));
    const restoDias = restoMeses % (1000 * 60 * 60 * 24);

    // Calcular horas
    const horas = Math.floor(restoDias / (1000 * 60 * 60));
    const restoHoras = restoDias % (1000 * 60 * 60);

    // Calcular minutos
    const minutos = Math.floor(restoHoras / (1000 * 60));
    const restoMinutos = restoHoras % (1000 * 60);

    // Calcular segundos
    const segundos = Math.floor(restoMinutos / 1000);

    return { anos, meses, dias, horas, minutos, segundos, total: diferenca };
};

/**
 * Formata uma data com hora para o padrão brasileiro mais legível (dd/mm/aaaa às hh:mm)
 * @param date - Data a ser formatada
 * @returns String formatada no padrão brasileiro com hora mais legível
 */
export const formatarDataHoraLegivel = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(',', ' às');
};