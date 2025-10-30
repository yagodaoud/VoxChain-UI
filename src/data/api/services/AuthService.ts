import axios from 'axios';
import type { Usuario } from '../../../domain/usuario';

export class AuthService {
    private readonly baseUrl: string;
    private readonly getAuthHeaders: () => Record<string, string>;

    constructor(baseUrl: string, getAuthHeaders: () => Record<string, string>) {
        this.baseUrl = baseUrl;
        this.getAuthHeaders = getAuthHeaders;
    }

    async autenticar(cpf: string, senha: string): Promise<Usuario> {
        cpf = cpf.replace(/\D/g, '');
        try {
            const response = await axios.post(`${this.baseUrl}/auth/login`, { cpf, senha });
            return {
                cpf,
                nome: response.data.nome,
                tipo: response.data.tipo,
                token: response.data.token
            };
        } catch (error) {
            throw new Error('Credenciais inválidas');
        }
    }
}


