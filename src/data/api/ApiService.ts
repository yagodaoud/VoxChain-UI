import type { Usuario } from '../../domain/usuario';
import type { Eleicao } from '../../domain/eleicao';
import type { Candidato } from '../../domain/candidato';
import type { Voto } from '../../domain/voto';
import { AuthService } from './services/AuthService';
import { ElectionsService } from './services/ElectionsService';
import { CandidatesService } from './services/CandidatesService';
import { VotesService } from './services/VotesService';
import { VotersService } from './services/VotersService';

export class ApiService {
    private readonly baseUrl = '/api/v1';

    private readonly auth: AuthService;
    private readonly elections: ElectionsService;
    private readonly candidates: CandidatesService;
    private readonly votes: VotesService;
    private readonly voters: VotersService;

    constructor() {
        const getHeaders = this.getAuthHeaders.bind(this);
        this.auth = new AuthService(this.baseUrl, getHeaders);
        this.elections = new ElectionsService(this.baseUrl, getHeaders);
        this.candidates = new CandidatesService(this.baseUrl, getHeaders);
        this.votes = new VotesService();
        this.voters = new VotersService(this.baseUrl, getHeaders);
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

    // Votos
    buscarMeusVotos(cpf: string): Promise<Voto[]> {
        return this.votes.buscarMeusVotos(cpf) as Promise<Voto[]>;
    }

    buscarVotos(): Promise<Voto[]> {
        return this.votes.buscarVotos() as Promise<Voto[]>;
    }

    registrarVoto(eleicaoId: string, categoriaId: string, numeroVoto: string): Promise<string> {
        return this.votes.registrarVoto(eleicaoId, categoriaId, numeroVoto);
    }

    registrarVotosBatch(eleicaoId: string, votos: Array<{ categoriaId: string, numeroVoto: string }>): Promise<string> {
        return this.votes.registrarVotosBatch(eleicaoId, votos);
    }

    // Eleitores
    listarEleitores() {
        return this.voters.listar();
    }

    criarEleitor(eleitor: import('../../domain/eleitor').Eleitor) {
        return this.voters.criar(eleitor);
    }

    atualizarEleitor(eleitor: import('../../domain/eleitor').Eleitor) {
        return this.voters.atualizar(eleitor);
    }

    deletarEleitor(cpfHash: string) {
        return this.voters.deletar(cpfHash);
    }
}


