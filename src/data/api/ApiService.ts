import type { Usuario } from '../../domain/usuario';
import type { Eleicao } from '../../domain/eleicao';
import type { Candidato } from '../../domain/candidato';
import type { Voto } from '../../domain/voto';
import type { Bloco } from '../../domain/bloco';
import { AuthService } from './services/AuthService';
import { ElectionsService, type ResultadoEleicao } from './services/ElectionsService';
import { CandidatesService } from './services/CandidatesService';
import { VotesService, type BlocoAnonimo } from './services/VotesService';
import { VotersService } from './services/VotersService';
import { TokenService } from './services/TokenService';

export class ApiService {
    private readonly baseUrl = '/api/v1';

    private readonly auth: AuthService;
    private readonly elections: ElectionsService;
    private readonly candidates: CandidatesService;
    private readonly votes: VotesService;
    private readonly voters: VotersService;
    private readonly tokens: TokenService;

    constructor() {
        const getHeaders = this.getAuthHeaders.bind(this);
        this.auth = new AuthService(this.baseUrl, getHeaders);
        this.elections = new ElectionsService(this.baseUrl, getHeaders);
        this.candidates = new CandidatesService(this.baseUrl, getHeaders);
        this.votes = new VotesService();
        this.voters = new VotersService(this.baseUrl, getHeaders);
        this.tokens = new TokenService(this.baseUrl, getHeaders);
    }

    private getAuthHeaders(): Record<string, string> {
        try {
            const storedUsuario = localStorage.getItem('usuario');
            if (!storedUsuario) return {};
            const usuario: Usuario = JSON.parse(storedUsuario);
            if (!usuario?.token) return {};
            return { Authorization: `Bearer ${usuario.token}` };
        } catch {
            return {};
        }
    }

    // Auth
    autenticar(cpf: string, senha: string): Promise<Usuario> {
        return this.auth.autenticar(cpf, senha);
    }

    // Eleições
    buscarEleicoes(): Promise<Eleicao[]> {
        return this.elections.listar();
    }

    criarEleicao(eleicao: Eleicao): Promise<Eleicao> {
        return this.elections.criar(eleicao);
    }

    atualizarEleicao(id: string, eleicao: Partial<Eleicao>): Promise<Eleicao> {
        return this.elections.atualizar(id, eleicao, () => this.elections.listar());
    }

    deletarEleicao(id: string): Promise<void> {
        return this.elections.deletar(id);
    }

    buscarResultados(eleicaoId: string, parcial: boolean = false): Promise<ResultadoEleicao> {
        return this.elections.buscarResultados(eleicaoId, parcial);
    }

    // Candidatos
    buscarCandidatos(): Promise<Candidato[]> {
        return this.candidates.listar();
    }

    buscarCandidatosPorEleicao(eleicaoId: string): Promise<Candidato[]> {
        return this.candidates.listarPorEleicao(eleicaoId);
    }

    criarCandidato(candidato: Candidato): Promise<Candidato> {
        return this.candidates.criar(candidato);
    }

    deletarCandidato(id: string): Promise<void> {
        return this.candidates.deletar(id);
    }

    // Tokens
    gerarTokenVotacao(eleicaoId: string): Promise<{ tokenAnonimo: string; validoAte: number }> {
        return this.tokens.gerarToken(eleicaoId);
    }

    // Votos
    registrarVoto(tokenVotacao: string, numeroCandidato: string, eleicaoId: string): Promise<string> {
        return this.votes.registrarVoto(tokenVotacao, numeroCandidato, eleicaoId);
    }

    registrarVotosBatch(tokenVotacao: string, eleicaoId: string, votos: Array<{ categoriaId: string, numeroVoto: string }>): Promise<string> {
        return this.votes.registrarVotosBatch(tokenVotacao, eleicaoId, votos);
    }

    // Eleitores
    listarEleitores() {
        return this.voters.listar();
    }

    criarEleitor(eleitor: { cpf: string, zona: number, secao: number, senha?: string }) {
        return this.voters.criar(eleitor);
    }

    atualizarEleitor(eleitor: import('../../domain/eleitor').Eleitor) {
        return this.voters.atualizar(eleitor);
    }

    deletarEleitor(cpfHash: string) {
        return this.voters.deletar(cpfHash);
    }

    // Votos do usuário e blocos
    buscarMeusVotos(cpf: string): Promise<BlocoAnonimo[]> {
        return this.votes.buscarMeusVotos(cpf);
    }

    buscarBlocoPorHash(hash: string): Promise<Bloco> {
        return this.votes.buscarBlocoPorHash(hash);
    }

    validarBloco(hash: string): Promise<{ valido: boolean; mensagem: string }> {
        return this.votes.validarBloco(hash);
    }

    buscarVotosPorBloco(hash: string): Promise<Voto[]> {
        return this.votes.buscarVotosPorBloco(hash);
    }
}
