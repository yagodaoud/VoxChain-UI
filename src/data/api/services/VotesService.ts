export class VotesService {
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async buscarMeusVotos(_cpf: string) {
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

    async buscarVotos() {
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
        return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    async registrarVotosBatch(eleicaoId: string, votos: Array<{ categoriaId: string, numeroVoto: string }>): Promise<string> {
        await this.delay(1500);
        console.log('Registrando votos em batch:', { eleicaoId, votos });
        return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }
}


