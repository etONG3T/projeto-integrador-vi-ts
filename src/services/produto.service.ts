import { Produto, type CriarProdutoDTO } from "../models/produto.model";
import { HttpError } from "../errors";

function validarDados(dados: unknown): CriarProdutoDTO {
  if (typeof dados !== "object" || dados === null ||
      !("nome" in dados) || !("preco" in dados)) {
    throw new HttpError(400, "nome e preco são obrigatórios");
  }
  if (typeof dados.nome !== "string" || typeof dados.preco !== "number") {
    throw new HttpError(400, "nome deve ser texto e preco deve ser número");
  }
  const nome = dados.nome.trim();
  if (nome.length === 0 || nome.length > 100) {
    throw new HttpError(400, "nome deve ter de 1 a 100 caracteres");
  }
  if (!Number.isFinite(dados.preco) || dados.preco < 0) {
    throw new HttpError(400, "preco deve ser um número válido maior ou igual a zero");
  }
  return { nome, preco: dados.preco };
}

function validarId(id: string): number {
  const numero = Number(id);
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(numero) || numero < 1) {
    throw new HttpError(400, "id deve ser um inteiro positivo");
  }
  return numero;
}

export async function listar(): Promise<Produto[]> {
  return Produto.findAll({ order: [["id", "ASC"]] });
}

export async function buscarPorId(id: string): Promise<Produto> {
  const produto = await Produto.findByPk(validarId(id));
  if (!produto) throw new HttpError(404, "Produto não encontrado");
  return produto;
}

export async function criar(dados: unknown): Promise<Produto> {
  return Produto.create(validarDados(dados));
}

export async function atualizar(id: string, dados: unknown): Promise<Produto> {
  const valores = validarDados(dados);
  const produto = await buscarPorId(id);
  return produto.update(valores);
}

export async function excluir(id: string): Promise<void> {
  const produto = await buscarPorId(id);
  await produto.destroy();
}
