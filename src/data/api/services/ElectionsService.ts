import axios from 'axios';
import { Eleicao } from '../../../domain/eleicao';
import { CategoriaEleicao } from '../../../domain/categoria';

interface CriarEleicaoRequest {
    nome: string;
    descricao: string;
    categorias: string[];
    dataInicio: number;
    dataFim: number;
}

export class ElectionsService {
    private readonly baseUrl: string;
    private readonly getAuthHeaders: () => Record<string, string>;

    constructor(baseUrl: string, getAuthHeaders: () => Record<string, string>) {
        this.baseUrl = baseUrl;
        this.getAuthHeaders = getAuthHeaders;
    }

    private mapApiToDomain(eleicao: Eleicao): Eleicao {
        const agora = new Date();
        const dataInicio = new Date(eleicao.dataInicio);
        const dataFim = new Date(eleicao.dataFim);

        eleicao.dataInicioDate = dataInicio;
        eleicao.dataFimDate = dataFim;

        let status: 'futura' | 'ativa' | 'encerrada';
        if (agora > dataFim) {
            status = 'encerrada';
        } else if (eleicao.ativa && agora >= dataInicio && agora <= dataFim) {
            status = 'ativa';
        } else if (agora < dataInicio) {
            status = 'futura';
        } else {
            status = eleicao.ativa ? 'ativa' : 'encerrada';
        }

        eleicao.status = status;

        return eleicao;
    }

    async listar(): Promise<Eleicao[]> {
        try {
            const response = await axios.get<Eleicao[]>(`${this.baseUrl}/eleicoes/listar`, { params: { finished: true } });
            return response.data.map(e => this.mapApiToDomain(e));
        } catch (error) {
            console.error('Erro ao buscar eleições da API:', error);
            return [];
        }
    }

    async criar(eleicao: Eleicao): Promise<Eleicao> {
        const payload: CriarEleicaoRequest = {
            nome: eleicao.nome,
            descricao: eleicao.descricao,
            categorias: this.categoriasParaEnumStrings(eleicao.categorias),
            dataInicio: eleicao.dataInicio,
            dataFim: eleicao.dataFim
        };

        try {
            const response = await axios.post<Eleicao>(`${this.baseUrl}/eleicoes/criar`, payload, { headers: this.getAuthHeaders() });
            return this.mapApiToDomain(response.data);
        } catch (error) {
            console.error('Erro ao criar eleição na API:', error);
            return eleicao;
        }
    }

    async atualizar(id: string, eleicao: Partial<Eleicao>, atual: () => Promise<Eleicao[]>): Promise<Eleicao> {
        const eleicoes = await atual();
        const eleicaoAtual = eleicoes.find(e => e.id === id);
        if (!eleicaoAtual) throw new Error('Eleição não encontrada');
        return { ...eleicaoAtual, ...eleicao };
    }

    async deletar(id: string): Promise<void> {
        console.log('Deletando eleição:', id);
    }

    private categoriasParaEnumStrings(categorias: CategoriaEleicao[]): string[] {
        return categorias
            .map(nome => this.normalizarParaEnum(nome))
            .filter(Boolean) as string[];
    }

    private normalizarParaEnum(valor: string): string | null {
        const upper = valor
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z_\s]/g, '')
            .trim()
            .replace(/\s+/g, '_')
            .toUpperCase();

        if (upper in CategoriaEleicao) {
            return upper;
        }

        const aliases: Record<string, CategoriaEleicao> = {
            PRESIDENTE: CategoriaEleicao.PRESIDENTE,
            GOVERNADOR: CategoriaEleicao.GOVERNADOR,
            SENADOR: CategoriaEleicao.SENADOR,
            DEPUTADO: CategoriaEleicao.DEPUTADO_FEDERAL,
            DEPUTADO_FEDERAL: CategoriaEleicao.DEPUTADO_FEDERAL,
            DEPUTADO_ESTADUAL: CategoriaEleicao.DEPUTADO_ESTADUAL,
            PREFEITO: CategoriaEleicao.PREFEITO,
            VEREADOR: CategoriaEleicao.VEREADOR
        };

        if (upper in aliases) {
            return aliases[upper];
        }

        return null;
    }

    async buscarResultados(eleicaoId: string, parcial: boolean = false): Promise<ResultadoEleicao> {
        try {
            const endpoint = parcial 
                ? `${this.baseUrl}/resultados/${eleicaoId}/parcial`
                : `${this.baseUrl}/resultados/${eleicaoId}`;
            
            const response = await axios.get<ResultadoEleicao>(endpoint);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar resultados:', error);
            throw error;
        }
    }
}

export interface ResultadoCandidato {
    candidatoId: string;
    nome: string;
    numero: string;
    partido: string;
    votos: number;
    porcentagem: number;
    eleito?: boolean;
}

export interface ResultadoCargo {
    cargo: string;
    totalVotos: number;
    votosValidos: number;
    votosBrancos: number;
    votosNulos: number;
    candidatos: ResultadoCandidato[];
}

export interface CandidatoResultado {
    nome: string;
    numero: string;
    partido: string;
    votos: number;
    percentual: string;
}

export interface ResultadoEleicao {
    eleicaoId: string;
    nomeEleicao?: string;
    status?: string;
    totalVotos: number;
    vencedor?: CandidatoResultado;
    candidatos?: CandidatoResultado[];
    resultadosPorCargo?: Record<string, ResultadoCargo>;
}
