export interface Usuario {
    cpf: string;
    nome: string;
    tipo: 'eleitor' | 'admin';
}