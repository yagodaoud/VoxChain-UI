export interface Candidato {
    id: string;
    cargo: string;
    numero: string;
    nome: string;
    uf: string;
    partido: string;
    fotoUrl: string;
}

export enum CargoCandidato {
    PRESIDENTE = 'PRESIDENTE',
    GOVERNADOR = 'GOVERNADOR',
    SENADOR = 'SENADOR',
    DEPUTADO_FEDERAL = 'DEPUTADO_FEDERAL',
    DEPUTADO_ESTADUAL = 'DEPUTADO_ESTADUAL',
    PREFEITO = 'PREFEITO',
    VEREADOR = 'VEREADOR'
}