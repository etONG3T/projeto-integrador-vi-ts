import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import request from "supertest";
import { jest, describe, test, expect, beforeAll, beforeEach, afterAll, afterEach } from "@jest/globals";

const pasta = mkdtempSync(join(tmpdir(), "produtos-jest-"));
process.env.DB_STORAGE = join(pasta, "teste.sqlite");
// Carregar depois de definir o banco de teste, sem tocar no banco da aplicação.
const { default: app } = require("../src/app") as typeof import("../src/app");
const { sequelize, conectarBanco } = require("../src/database") as typeof import("../src/database");
const { Produto } = require("../src/models/produto.model") as typeof import("../src/models/produto.model");
const service = require("../src/services/produto.service") as typeof import("../src/services/produto.service");

beforeAll(async () => { await conectarBanco(); });
beforeEach(async () => { await Produto.destroy({ where: {} }); });
afterEach(() => { jest.restoreAllMocks(); });
afterAll(async () => { await sequelize.close(); rmSync(pasta, { recursive: true, force: true }); });

describe("CRUD de produtos com Sequelize e SQLite real", () => {
  test("cria, lista, consulta, atualiza e exclui", async () => {
    expect((await request(app).get("/produtos")).body).toEqual([]);
    const criado = await request(app).post("/produtos").send({ nome: " Teclado ", preco: 180 });
    expect(criado.status).toBe(201);
    const id = criado.body.id as number;
    expect(criado.body).toEqual({ id, nome: "Teclado", preco: 180 });
    expect((await Produto.findByPk(id))?.nome).toBe("Teclado");
    const lista = await request(app).get("/produtos");
    expect(lista.status).toBe(200);
    expect(lista.body).toEqual([criado.body]);
    expect((await request(app).get(`/produtos/${id}`)).body).toEqual(criado.body);
    const atualizado = await request(app).put(`/produtos/${id}`).send({ nome: "Mouse", preco: 0 });
    expect(atualizado.status).toBe(200);
    expect(atualizado.body).toEqual({ id, nome: "Mouse", preco: 0 });
    expect((await Produto.findByPk(id))?.preco).toBe(0);
    const excluido = await request(app).delete(`/produtos/${id}`);
    expect(excluido.status).toBe(204);
    expect(excluido.text).toBe("");
    expect(await Produto.findByPk(id)).toBeNull();
    expect((await request(app).get(`/produtos/${id}`)).status).toBe(404);
  });

  test("dados persistem em arquivo e são lidos por outra conexão", async () => {
    const produto = await service.criar({ nome: "Persistente", preco: 25 });
    const { Sequelize } = require("sequelize") as typeof import("sequelize");
    const outroBanco = new Sequelize({ dialect: "sqlite", storage: process.env.DB_STORAGE, logging: false });
    try {
      const [rows] = await outroBanco.query("SELECT nome, preco FROM produtos WHERE id = :id", { replacements: { id: produto.id } });
      expect(rows).toEqual([{ nome: "Persistente", preco: 25 }]);
    } finally { await outroBanco.close(); }
  });

  test.each(["get", "put", "delete"] as const)("%s retorna 404 para produto inexistente", async (method) => {
    const resposta = await request(app)[method]("/produtos/999999").send({ nome: "Teste", preco: 1 });
    expect(resposta.status).toBe(404);
    expect(resposta.body).toEqual({ mensagem: "Produto não encontrado" });
  });

  test.each(["abc", "0", "-1", "1.5", "9007199254740992"])("rejeita id inválido %s", async (id) => {
    const resposta = await request(app).get(`/produtos/${id}`);
    expect(resposta.status).toBe(400);
    expect(resposta.body.mensagem).toBe("id deve ser um inteiro positivo");
  });

  test.each([
    {}, { nome: "Teste" }, { preco: 1 }, { nome: 123, preco: 1 },
    { nome: "Teste", preco: "1" }, { nome: "" , preco: 1 },
    { nome: "   ", preco: 1 }, { nome: "a".repeat(101), preco: 1 },
    { nome: "Teste", preco: -1 }, { nome: "Teste", preco: null }, []
  ])("rejeita criação inválida %j sem gravar", async (dados) => {
    const resposta = await request(app).post("/produtos").send(dados);
    expect(resposta.status).toBe(400);
    expect(resposta.body.mensagem).toEqual(expect.any(String));
    expect(await Produto.count()).toBe(0);
  });

  test("rejeita corpo ausente, null e preço não finito", async () => {
    expect((await request(app).post("/produtos")).status).toBe(400);
    await expect(service.criar(null)).rejects.toThrow("obrigatórios");
    await expect(service.criar("texto")).rejects.toThrow("obrigatórios");
    await expect(service.criar({ nome: "Teste", preco: Infinity })).rejects.toThrow("válido");
    await expect(service.criar({ nome: "Teste", preco: NaN })).rejects.toThrow("válido");
  });

  test("atualização inválida mantém os dados anteriores", async () => {
    const produto = await service.criar({ nome: "Original", preco: 10 });
    const resposta = await request(app).put(`/produtos/${produto.id}`).send({ nome: "", preco: 20 });
    expect(resposta.status).toBe(400);
    expect((await service.buscarPorId(String(produto.id))).nome).toBe("Original");
  });

  test("IDs não são reutilizados após exclusão", async () => {
    const primeiro = await service.criar({ nome: "A", preco: 1 });
    await service.excluir(String(primeiro.id));
    const segundo = await service.criar({ nome: "B", preco: 2 });
    expect(segundo.id).toBeGreaterThan(primeiro.id);
  });

  test("JSON malformado recebe erro legível", async () => {
    const resposta = await request(app).post("/produtos").set("Content-Type", "application/json").send('{"nome":');
    expect(resposta.status).toBe(400);
    expect(resposta.body).toEqual({ mensagem: "JSON inválido" });
  });

  test("falhas no banco retornam 500 sem expor detalhes", async () => {
    jest.spyOn(Produto, "findAll").mockRejectedValue(new Error("detalhe privado"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    const resposta = await request(app).get("/produtos");
    expect(resposta.status).toBe(500);
    expect(resposta.body).toEqual({ mensagem: "Erro interno do servidor" });
  });

  test("entrega a interface do CRUD", async () => {
    const resposta = await request(app).get("/");
    expect(resposta.status).toBe(200);
    expect(resposta.text).toContain('id="produto-form"');
    expect(resposta.text).toContain('id="produtos"');
  });
});
