import type { Voto } from './voto';

export interface Bloco {
    hash: string;
    timestamp: Date;
    votos: Voto[];
    hashAnterior?: string;
    validado?: boolean;
}

