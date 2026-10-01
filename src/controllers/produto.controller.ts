import type { Request, Response } from "express";
import * as service from "../services/produto.service";

export function listar(_req: Request, res: Response): void {
  const produtos = service.listar();
  res.status(200).json(produtos);
}

export function buscarPorId(
  req: Request<{ id: string }>,
  res: Response
): void {
  const produto = service.buscarPorId(req.params.id);

  if (!produto) {
    res.status(404).json({
      mensagem: "Produto não encontrado"
    });
    return;
  }

  res.status(200).json(produto);
}

export function criar(
  req: Request<Record<string, never>, unknown, unknown>,
  res: Response
): void {
  try {
    const produto = service.criar(req.body);
    res.status(201).json(produto);
  } catch (error: unknown) {
    const mensagem =
      error instanceof Error ? error.message : "Erro ao criar produto";

    res.status(400).json({ mensagem });
  }
}
