import type { Request, Response } from "express";
import { listar as listarProdutos, buscarPorId as buscarProduto, criar as criarProduto,
  atualizar as atualizarProduto, excluir as excluirProduto } from "../services/produto.service";

type ProdutoRequest = Request<{ id: string }, unknown, unknown>;

export async function listar(_req: Request, res: Response): Promise<void> {
  res.status(200).json(await listarProdutos());
}

export async function buscarPorId(req: ProdutoRequest, res: Response): Promise<void> {
  res.status(200).json(await buscarProduto(req.params.id));
}

export async function criar(req: Request<Record<string, never>, unknown, unknown>, res: Response): Promise<void> {
  res.status(201).json(await criarProduto(req.body));
}

export async function atualizar(req: ProdutoRequest, res: Response): Promise<void> {
  res.status(200).json(await atualizarProduto(req.params.id, req.body));
}

export async function excluir(req: ProdutoRequest, res: Response): Promise<void> {
  await excluirProduto(req.params.id);
  res.status(204).send();
}
