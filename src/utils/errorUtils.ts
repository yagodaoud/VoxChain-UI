import axios from 'axios';

/**
 * Extrai a mensagem de erro de uma exceção da API.
 * Tenta extrair de diferentes formatos de resposta da API.
 */
export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (axios.isAxiosError(error)) {
        // Tenta extrair mensagem do response.data
        const errorData = error.response?.data;
        
        if (typeof errorData === 'string') {
            return errorData;
        }
        
        if (errorData && typeof errorData === 'object') {
            // Tenta diferentes propriedades comuns
            if ('message' in errorData && typeof errorData.message === 'string') {
                return errorData.message;
            }
            if ('error' in errorData && typeof errorData.error === 'string') {
                return errorData.error;
            }
            if ('msg' in errorData && typeof errorData.msg === 'string') {
                return errorData.msg;
            }
        }
        
        // Se não encontrou mensagem específica, usa status code para mensagem genérica
        if (error.response?.status) {
            switch (error.response.status) {
                case 400:
                    return 'Requisição inválida. Verifique os dados enviados.';
                case 401:
                    return 'Não autorizado. Verifique suas credenciais.';
                case 403:
                    return 'Acesso negado. Você não tem permissão para esta ação.';
                case 404:
                    return 'Recurso não encontrado.';
                case 409:
                    return 'Conflito. Esta operação não pode ser realizada.';
                case 500:
                    return 'Erro interno do servidor. Tente novamente mais tarde.';
                default:
                    return error.response.statusText || defaultMessage;
            }
        }
        
        return error.message || defaultMessage;
    }
    
    if (error instanceof Error) {
        return error.message || defaultMessage;
    }
    
    return defaultMessage;
};

