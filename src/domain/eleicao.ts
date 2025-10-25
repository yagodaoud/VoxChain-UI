import { Categoria } from './categoria';

export interface Eleicao {
    id: string;
    nome: string;
    descricao: string;
    dataInicio: Date;
    dataFim: Date;
    categorias: Categoria[];
    status: 'futura' | 'ativa' | 'encerrada';
}