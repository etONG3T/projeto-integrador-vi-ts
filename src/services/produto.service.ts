import { Produto } from "../models/produto.model";

const produtos: Produto[] = [
  new Produto(1, "Notebook", 3500),
  new Produto(2, "Mouse", 120)
];

export function listar(): Produto[] {
  return produtos;
}

export function buscarPorId(id: string | number): Produto | undefined {
  return produtos.find((produto) => produto.id === Number(id));
}

export function criar(dados: unknown): Produto {
  if (typeof dados !== "object" || dados === null ||
      !("nome" in dados) || !("preco" in dados) ||
      !dados.nome || dados.preco == null) {
    throw new Error("nome e preco são obrigatórios");
  }

  if (typeof dados.nome !== "string" || typeof dados.preco !== "number") {
    throw new Error("nome deve ser texto e preco deve ser número");
  }

  const novoId = produtos.length + 1;
  const produto = new Produto(novoId, dados.nome, dados.preco);

  produtos.push(produto);

  return produto;
}
