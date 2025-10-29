import type { Usuario } from '../../domain/usuario';
import type { Eleicao } from '../../domain/eleicao';
import type { Voto } from '../../domain/voto';
import type { Candidato } from '../../domain/candidato';

export class MockApiService {
    // URL base para futura integração com API real
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private readonly baseUrl = 'http://localhost:8080';

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
                            { numero: '45', nome: 'Maria Santos', partido: 'PSDB' },
                            { numero: '22', nome: 'Pedro Costa', partido: 'PL' },
                            { numero: '30', nome: 'Ana Beatriz', partido: 'NOVO' },
                            { numero: '12', nome: 'Roberto Lima', partido: 'PDT' },
                            { numero: '50', nome: 'Fernanda Souza', partido: 'PSOL' },
                            { numero: '77', nome: 'Marcos Pereira', partido: 'SOLIDARIEDADE' },
                            { numero: '44', nome: 'Juliana Alves', partido: 'REPUBLICANOS' }
                        ]
                    },
                    {
                        id: 'cat2',
                        nome: 'Governador',
                        candidatos: [
                            { numero: '22', nome: 'Carlos Oliveira', partido: 'MDB' },
                            { numero: '40', nome: 'Ana Costa', partido: 'PSB' },
                            { numero: '25', nome: 'Miguel Santos', partido: 'DEM' },
                            { numero: '33', nome: 'Patricia Lima', partido: 'PMN' },
                            { numero: '18', nome: 'Ricardo Silva', partido: 'REDE' },
                            { numero: '55', nome: 'Camila Ferreira', partido: 'PSD' },
                            { numero: '80', nome: 'Antonio Rocha', partido: 'UNIÃO' },
                            { numero: '36', nome: 'Lucia Mendes', partido: 'PTC' }
                        ]
                    },
                    {
                        id: 'cat3',
                        nome: 'Senador',
                        candidatos: [
                            { numero: '22', nome: 'Eduardo Martins', partido: 'PT' },
                            { numero: '20', nome: 'Silvia Campos', partido: 'PSDB' },
                            { numero: '14', nome: 'Paulo Henrique', partido: 'PTB' },
                            { numero: '27', nome: 'Beatriz Nunes', partido: 'DC' },
                            { numero: '35', nome: 'Felipe Torres', partido: 'PMB' },
                            { numero: '65', nome: 'Renata Dias', partido: 'PCdoB' },
                            { numero: '90', nome: 'Gabriel Santos', partido: 'PROS' },
                            { numero: '23', nome: 'Mariana Costa', partido: 'CIDADANIA' }
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
                categorias: [
                    {
                        id: 'cat4',
                        nome: 'Prefeito',
                        candidatos: [
                            { numero: '11', nome: 'José da Silva', partido: 'PT' },
                            { numero: '25', nome: 'Maria Oliveira', partido: 'PSDB' },
                            { numero: '33', nome: 'Carlos Mendes', partido: 'MDB' },
                            { numero: '44', nome: 'Ana Paula', partido: 'PSB' },
                            { numero: '55', nome: 'Roberto Santos', partido: 'PL' },
                            { numero: '66', nome: 'Fernanda Costa', partido: 'NOVO' },
                            { numero: '77', nome: 'Paulo Lima', partido: 'PDT' },
                            { numero: '88', nome: 'Juliana Alves', partido: 'PSOL' }
                        ]
                    },
                    {
                        id: 'cat5',
                        nome: 'Vereador',
                        candidatos: [
                            { numero: '10', nome: 'Antonio Silva', partido: 'PT' },
                            { numero: '20', nome: 'Beatriz Costa', partido: 'PSDB' },
                            { numero: '30', nome: 'Miguel Santos', partido: 'MDB' },
                            { numero: '40', nome: 'Patricia Lima', partido: 'PSB' },
                            { numero: '50', nome: 'Ricardo Oliveira', partido: 'PL' },
                            { numero: '60', nome: 'Camila Ferreira', partido: 'NOVO' },
                            { numero: '70', nome: 'Gabriel Rocha', partido: 'PDT' },
                            { numero: '80', nome: 'Lucia Mendes', partido: 'PSOL' },
                            { numero: '90', nome: 'Eduardo Torres', partido: 'DEM' },
                            { numero: '12', nome: 'Silvia Dias', partido: 'PMN' }
                        ]
                    }
                ]
            }
        ];
    }

    async buscarMeusVotos(_cpf: string): Promise<Voto[]> {
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
        await this.delay(1200);
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
        await this.delay(800);
        return eleicao;
    }

    async atualizarEleicao(id: string, eleicao: Partial<Eleicao>): Promise<Eleicao> {
        await this.delay(800);
        const eleicoes = await this.buscarEleicoes();
        const eleicaoAtual = eleicoes.find(e => e.id === id);
        if (!eleicaoAtual) throw new Error('Eleição não encontrada');
        return { ...eleicaoAtual, ...eleicao };
    }

    async deletarEleicao(id: string): Promise<void> {
        await this.delay(600);
        console.log('Deletando eleição:', id);
    }

    async buscarCandidatos(): Promise<Array<{ categoriaId: string; candidato: Candidato }>> {
        await this.delay(500);
        const eleicoes = await this.buscarEleicoes();
        const candidatos: Array<{ categoriaId: string; candidato: Candidato }> = [];

        eleicoes.forEach(eleicao => {
            eleicao.categorias.forEach(categoria => {
                categoria.candidatos.forEach(candidato => {
                    candidatos.push({ categoriaId: categoria.id, candidato });
                });
            });
        });

        return candidatos;
    }

    async criarCandidato(_categoriaId: string, candidato: Candidato): Promise<Candidato> {
        await this.delay(800);
        return candidato;
    }

    async deletarCandidato(categoriaId: string, numeroCandidato: string): Promise<void> {
        await this.delay(600);
        console.log('Deletando candidato:', { categoriaId, numeroCandidato });
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}