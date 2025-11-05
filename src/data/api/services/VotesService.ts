import axios from 'axios';

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
}
