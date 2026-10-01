import express from "express";
import type { ErrorRequestHandler } from "express";
import { resolve } from "node:path";
import { HttpError } from "./errors";
import produtoRoutes from "./routes/produto.routes";

const app = express();
app.use(express.json());
app.use("/produtos", produtoRoutes);
app.use(express.static(resolve("public")));

const tratarErro: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ mensagem: error.message });
    return;
  }
  if (error instanceof SyntaxError && "status" in error && error.status === 400) {
    res.status(400).json({ mensagem: "JSON inválido" });
    return;
  }
  console.error(error);
  res.status(500).json({ mensagem: "Erro interno do servidor" });
};
app.use(tratarErro);

export default app;
