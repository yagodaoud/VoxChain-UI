import axios from 'axios';
import type { Usuario } from '../../domain/usuario';
import type { Eleicao } from '../../domain/eleicao';
import type { Categoria } from '../../domain/categoria';
import type { Voto } from '../../domain/voto';
import type { Candidato } from '../../domain/candidato';

// Tipo para resposta da API blockchain
interface EleicaoApiResponse {
    id: string;
    nome: string;
    descricao: string;
    categorias: string[];
    dataInicio: number; // timestamp Unix
    dataFim: number; // timestamp Unix
    ativa: boolean;
}

export class MockApiService {
    // URL base para integração com API blockchain (via proxy do Vite)
    private readonly baseUrl = '/api/v1';

    // Simula autenticação Basic
    async autenticar(cpf: string, _senha: string): Promise<Usuario> {
        // Mock: aceita qualquer CPF/senha por enquanto
        await this.delay(800);

        // Determina role baseado no CPF (mock)
        let tipo: 'eleitor' | 'admin' | 'super-admin';
        let nome = 'Eleitor Demo';

        if (cpf === '111.111.111-11') {
            tipo = 'super-admin';
            nome = 'Super Admin';
        } else if (cpf === '000.000.000-00') {
            tipo = 'admin';
            nome = 'Administrador';
        } else {
            tipo = 'eleitor';
            nome = 'Eleitor Demo';
        }

        return {
            cpf,
            nome,
            tipo,
        };
    }

    /**
     * Converte resposta da API blockchain para o formato do domínio
     */
    private mapearEleicaoApiParaDomínio(eleicaoApi: EleicaoApiResponse): Eleicao {
        const agora = new Date();
        const dataInicio = new Date(eleicaoApi.dataInicio * 1000); // Converte timestamp Unix para Date
        const dataFim = new Date(eleicaoApi.dataFim * 1000);

        // Determina o status baseado na data atual e no campo ativa
        let status: 'futura' | 'ativa' | 'encerrada';
        if (agora > dataFim) {
            // Eleição já passou da data de término
            status = 'encerrada';
        } else if (eleicaoApi.ativa && agora >= dataInicio && agora <= dataFim) {
            // Eleição ativa e dentro do período
            status = 'ativa';
        } else if (agora < dataInicio) {
            // Eleição ainda não começou
            status = 'futura';
        } else {
            // Caso padrão: se não está ativa mas está no período, considera encerrada
            status = eleicaoApi.ativa ? 'ativa' : 'encerrada';
        }

        // Converte array de strings de categorias para objetos Categoria
        // Por enquanto, as categorias não terão candidatos (serão carregados depois quando necessário)
        const categorias: Categoria[] = eleicaoApi.categorias.map((nomeCategoria, index) => ({
            id: `${eleicaoApi.id}-cat-${index}`,
            nome: nomeCategoria,
            candidatos: [] // Candidatos serão carregados quando necessário
        }));

        return {
            id: eleicaoApi.id,
            nome: eleicaoApi.nome,
            descricao: eleicaoApi.descricao,
            dataInicio,
            dataFim,
            status,
            categorias
        };
    }

    async buscarEleicoes(): Promise<Eleicao[]> {
        try {
            // Chama a API blockchain real
            const response = await axios.get<EleicaoApiResponse[]>(
                `${this.baseUrl}/eleicoes/listar`,
                {
                    params: { finished: true }
                }
            );

            // Mapeia cada eleição da resposta para o formato do domínio
            return response.data.map(eleicaoApi => this.mapearEleicaoApiParaDomínio(eleicaoApi));
        } catch (error) {
            console.error('Erro ao buscar eleições da API:', error);
            // Em caso de erro, retorna array vazio ou pode lançar o erro
            // Por enquanto, retorna array vazio para não quebrar a UI
            return [];
        }
    }

    async buscarMeusVotos(_cpf: string): Promise<Voto[]> {
        return [
            {
                eleicaoId: '0',
                eleicaoNome: 'Eleições Gerais 2024',
                categoriaId: 'cat1',
                categoriaNome: 'Presidente',
                candidatoNumero: '13',
                candidatoNome: 'João Silva',
                timestamp: new Date('2024-10-15'),
                hashBlockchain: '0x7a8f9d2e4b1c6a3f5e8d9c2b4a6f8e1d3c5b7a9f2e4d6c8b1a3f5e7d9c2b4a6f'
            },
            {
                eleicaoId: '0',
                eleicaoNome: 'Eleições Gerais 2024',
                categoriaId: 'cat2',
                categoriaNome: 'Governador',
                candidatoNumero: '22',
                candidatoNome: 'Carlos Oliveira',
                timestamp: new Date('2024-10-15'),
                hashBlockchain: '0x9b2c4d6e8f1a3c5b7d9e2f4a6c8b1d3e5f7a9c2b4d6e8f1a3c5b7d9e2f4a6c8b'
            },
            {
                eleicaoId: '0',
                eleicaoNome: 'Eleições Gerais 2024',
                categoriaId: 'cat3',
                categoriaNome: 'Senador',
                candidatoNumero: '22',
                candidatoNome: 'Eduardo Martins',
                timestamp: new Date('2024-10-15'),
                hashBlockchain: '0x3f5e7d9c2b4a6f8e1d3c5b7a9f2e4d6c8b1a3f5e7d9c2b4a6f8e1d3c5b7a9f2e4'
            }
        ];
    }

    async registrarVoto(_eleicaoId: string, _categoriaId: string, _numeroVoto: string): Promise<string> {
        // Retorna hash simulado
        return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    async registrarVotosBatch(eleicaoId: string, votos: Array<{ categoriaId: string, numeroVoto: string }>): Promise<string> {
        await this.delay(1500); // Simula processamento batch
        console.log('Registrando votos em batch:', { eleicaoId, votos });
        // Retorna hash simulado para o batch completo
        return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    // Admin methods
    async criarEleicao(eleicao: Eleicao): Promise<Eleicao> {
        return eleicao;
    }

    async atualizarEleicao(id: string, eleicao: Partial<Eleicao>): Promise<Eleicao> {
        const eleicoes = await this.buscarEleicoes();
        const eleicaoAtual = eleicoes.find(e => e.id === id);
        if (!eleicaoAtual) throw new Error('Eleição não encontrada');
        return { ...eleicaoAtual, ...eleicao };
    }

    async deletarEleicao(id: string): Promise<void> {
        console.log('Deletando eleição:', id);
    }

    async buscarCandidatos(): Promise<Array<Candidato>> {
        const response = await axios.get<Candidato[]>(
            `${this.baseUrl}/candidatos/listar`
        );

        return response.data;
    }

    async criarCandidato(_categoriaId: string, candidato: Candidato): Promise<Candidato> {
        return candidato;
    }

    async deletarCandidato(id: string): Promise<void> {
        try {
            await axios.delete(`${this.baseUrl}/candidatos/deletar/${id}`);
        } catch (error) {
            console.error('Erro ao deletar candidato:', error);
            throw error;
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}