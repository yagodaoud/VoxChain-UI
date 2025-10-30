import { CategoriaEleicao } from './categoria';

export interface Eleicao {
    id: string;
    nome: string;
    descricao: string;
    dataInicio: number;
    dataFim: number;
    dataInicioDate: Date;
    dataFimDate: Date;
    categorias: CategoriaEleicao[];
    ativa: boolean;
    status?: string;
}