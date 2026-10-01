import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import app from "../src/app";

test("API mantém listagem, consulta, criação e erros", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}/produtos`;

  let response = await fetch(url);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [
    { id: 1, nome: "Notebook", preco: 3500 },
    { id: 2, nome: "Mouse", preco: 120 }
  ]);
  response = await fetch(`${url}/1`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { id: 1, nome: "Notebook", preco: 3500 });
  for (const id of ["999", "abc"]) {
    response = await fetch(`${url}/${id}`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { mensagem: "Produto não encontrado" });
  }
  for (const body of [{}, { nome: "Teste" }, { nome: "Teste", preco: "10" }, null]) {
    response = await fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    assert.equal(response.status, 400);
  }
  response = await fetch(url, { method: "POST" });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { mensagem: "nome e preco são obrigatórios" });
  response = await fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Teclado", preco: 0 })
  });
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { id: 3, nome: "Teclado", preco: 0 });
  response = await fetch(`${url}/3`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { id: 3, nome: "Teclado", preco: 0 });
});
