import axios from 'axios';

export class TokenService {
    private readonly baseUrl: string;
    private readonly getAuthHeaders: () => Record<string, string>;

    constructor(baseUrl: string, getAuthHeaders: () => Record<string, string>) {
        this.baseUrl = baseUrl;
        this.getAuthHeaders = getAuthHeaders;
    }

    async gerarToken(eleicaoId: string): Promise<{ tokenAnonimo: string; validoAte: number }> {
        try {
            const response = await axios.post<{ tokenAnonimo: string; validoAte: number }>(
                `${this.baseUrl}/tokens/gerar`,
                { eleicaoId },
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao gerar token de votação:', error);
            throw error;
        }
    }
}

