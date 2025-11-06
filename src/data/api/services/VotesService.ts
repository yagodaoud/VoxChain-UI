import axios from 'axios';
import type { Voto } from '../../../domain/voto';
import type { Bloco } from '../../../domain/bloco';

export class VotesService {
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async registrarVoto(tokenVotacao: string, numeroCandidato: string, eleicaoId: string): Promise<string> {
        try {
            const response = await axios.post<{ hash: string }>(
                '/api/v1/votos/registrar',
                {
                    tokenVotacao,
                    numeroCandidato,
                    eleicaoId
                }
            );
            return response.data.hash;
        } catch (error) {
            console.error('Erro ao registrar voto:', error);
            throw error;
        }
    }

    async registrarVotosBatch(
        tokenVotacao: string,
        eleicaoId: string,
        votos: Array<{ categoriaId: string, numeroVoto: string }>
    ): Promise<string> {
        await this.delay(1500);
        try {
            const response = await axios.post<{ hash: string }>(
                '/api/v1/votos/batch',
                { tokenVotacao, eleicaoId, votos }
            );
            return response.data.hash;
        } catch (error) {
            console.error('Erro ao registrar votos:', error);
            throw error;
        }
    }

    async buscarMeusVotos(cpf: string): Promise<Voto[]> {
        try {
            const response = await axios.get<{ votos: Voto[] }>('/api/v1/votos/meus-votos', {
                params: { cpf }
            });
            return response.data.votos.map((voto: Voto) => ({
                ...voto,
                timestamp: new Date(voto.timestamp)
            }));
        } catch (error) {
            console.error('Erro ao buscar meus votos:', error);
            throw error;
        }
    }

    async buscarBlocoPorHash(hash: string): Promise<Bloco> {
        try {
            const response = await axios.get<Bloco>(`/api/v1/blocos/${hash}`);
            return {
                ...response.data,
                timestamp: new Date(response.data.timestamp),
                votos: response.data.votos.map(voto => ({
                    ...voto,
                    timestamp: new Date(voto.timestamp)
                }))
            };
        } catch (error) {
            console.error('Erro ao buscar bloco:', error);
            throw error;
        }
    }

    async validarBloco(hash: string): Promise<{ valido: boolean; mensagem: string }> {
        try {
            const response = await axios.post<{ valido: boolean; mensagem: string }>(
                `/api/v1/blocos/${hash}/validar`
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao validar bloco:', error);
            throw error;
        }
    }

    async buscarVotosPorBloco(hash: string): Promise<Voto[]> {
        try {
            const response = await axios.get<{ votos: Voto[] }>(`/api/v1/blocos/${hash}/votos`);
            return response.data.votos.map((voto: Voto) => ({
                ...voto,
                timestamp: new Date(voto.timestamp)
            }));
        } catch (error) {
            console.error('Erro ao buscar votos do bloco:', error);
            throw error;
        }
    }
}
