import { Candidato } from './candidato';

export interface Categoria {
    id: string;
    nome: string;
    candidatos: Candidato[];
}

export enum CategoriaEleicao {
    PRESIDENTE = 'PRESIDENTE',
    GOVERNADOR = 'GOVERNADOR',
    SENADOR = 'SENADOR',
    DEPUTADO_FEDERAL = 'DEPUTADO_FEDERAL',
    DEPUTADO_ESTADUAL = 'DEPUTADO_ESTADUAL',
    PREFEITO = 'PREFEITO',
    VEREADOR = 'VEREADOR'
}