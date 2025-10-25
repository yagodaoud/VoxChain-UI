import { Candidato } from './candidato';

export interface Categoria {
    id: string;
    nome: string;
    candidatos: Candidato[];
}