export interface Voto {
  eleicaoId: string;
  eleicaoNome: string;
  categoriaId: string;
  categoriaNome: string;
  candidatoNumero: string;
  candidatoNome: string;
  timestamp: Date;
  blocoHash: string;
}
