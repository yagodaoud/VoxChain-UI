import type { Usuario } from '../../domain/usuario';
import type { Eleicao } from '../../domain/eleicao';
import type { Voto } from '../../domain/voto';

export class MockApiService {
    private readonly baseUrl = 'http://localhost:8080'; // Trocar quando integrar API real

    // Simula autenticação Basic
    async autenticar(cpf: string, senha: string): Promise<Usuario> {
        // Mock: aceita qualquer CPF/senha por enquanto
        await this.delay(800);
        return {
            cpf: cpf,
            nome: 'Eleitor Demo',
            tipo: 'eleitor'
        };
    }

    async buscarEleicoes(): Promise<Eleicao[]> {
        await this.delay(500);
        return [
            {
                id: '1',
                nome: 'Eleições Gerais 2025',
                descricao: 'Eleição para Presidente, Governador e Senador',
                dataInicio: new Date('2025-10-01'),
                dataFim: new Date('2025-10-31'),
                status: 'ativa',
                categorias: [
                    {
                        id: 'cat1',
                        nome: 'Presidente',
                        candidatos: [
                            { numero: '13', nome: 'João Silva', partido: 'PT' },
                            { numero: '45', nome: 'Maria Santos', partido: 'PSDB' }
                        ]
                    },
                    {
                        id: 'cat2',
                        nome: 'Governador',
                        candidatos: [
                            { numero: '15', nome: 'Carlos Oliveira', partido: 'MDB' },
                            { numero: '40', nome: 'Ana Costa', partido: 'PSB' }
                        ]
                    }
                ]
            },
            {
                id: '2',
                nome: 'Eleições Municipais 2026',
                descricao: 'Eleição para Prefeito e Vereadores',
                dataInicio: new Date('2026-03-01'),
                dataFim: new Date('2026-03-15'),
                status: 'futura',
                categorias: []
            }
        ];
    }

    async buscarMeusVotos(cpf: string): Promise<Voto[]> {
        await this.delay(600);
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
            }
        ];
    }

    async registrarVoto(eleicaoId: string, categoriaId: string, numeroVoto: string): Promise<string> {
        await this.delay(1200);
        // Retorna hash simulado
        return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}