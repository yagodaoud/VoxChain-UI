import axios from 'axios';
import type { Candidato } from '../../../domain/candidato';

export class CandidatesService {
    private readonly baseUrl: string;
    private readonly getAuthHeaders: () => Record<string, string>;

    constructor(baseUrl: string, getAuthHeaders: () => Record<string, string>) {
        this.baseUrl = baseUrl;
        this.getAuthHeaders = getAuthHeaders;
    }

    async listar(): Promise<Candidato[]> {
        const response = await axios.get<Candidato[]>(`${this.baseUrl}/candidatos/listar`);
        return response.data;
    }

    async listarPorEleicao(eleicaoId: string): Promise<Candidato[]> {
        const response = await axios.get<Candidato[]>(`${this.baseUrl}/candidatos/listar?eleicaoId=${eleicaoId}`);
        return response.data;
    }

    async criar(candidato: Candidato): Promise<Candidato> {
        try {
            const response = await axios.post<Candidato>(`${this.baseUrl}/candidatos/criar`, candidato, { headers: this.getAuthHeaders() });
            return response.data;
        } catch (error) {
            console.error('Erro ao criar candidato:', error);
            return candidato;
        }
    }

    async deletar(id: string): Promise<void> {
        try {
            await axios.delete(`${this.baseUrl}/candidatos/deletar/${id}`);
        } catch (error) {
            console.error('Erro ao deletar candidato:', error);
            throw error;
        }
    }
}


