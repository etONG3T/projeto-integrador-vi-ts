export class Produto {
  constructor(
    public readonly id: number,
    public nome: string,
    public preco: number
  ) {}
}

export interface CriarProdutoDTO {
  nome: string;
  preco: number;
}
