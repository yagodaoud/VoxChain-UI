import axios from 'axios';
import type { Eleitor } from '../../../domain/eleitor';

export class VotersService {
    private readonly baseUrl: string;
    private readonly getAuthHeaders: () => Record<string, string>;

    constructor(baseUrl: string, getAuthHeaders: () => Record<string, string>) {
        this.baseUrl = baseUrl;
        this.getAuthHeaders = getAuthHeaders;
    }

    async listar(): Promise<Eleitor[]> {
        try {
            const response = await axios.get<Eleitor[]>(`${this.baseUrl}/eleitores/listar`, { headers: this.getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Erro ao listar eleitores:', error);
            return [];
        }
    }

    async criar(eleitor: { cpf: string, zona: number, secao: number, senha?: string }): Promise<Eleitor> {
        try {
            const response = await axios.post<Eleitor>(`${this.baseUrl}/eleitores/criar`, eleitor, { headers: this.getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar eleitor:', error);
            throw error;
        }
    }

    async atualizar(eleitor: Eleitor): Promise<Eleitor> {
        try {
            const response = await axios.put<Eleitor>(`${this.baseUrl}/eleitor/atualizar`, eleitor, { headers: this.getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar eleitor:', error);
            return eleitor;
        }
    }

    async deletar(cpfHash: string): Promise<void> {
        try {
            await axios.delete(`${this.baseUrl}/eleitor/deletar/${cpfHash}`, { headers: this.getAuthHeaders() });
        } catch (error) {
            console.error('Erro ao deletar eleitor:', error);
            throw error;
        }
    }
}


