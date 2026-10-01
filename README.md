# Projeto Integrador VI — TypeScript

CRUD de produtos com TypeScript, Express, Sequelize e SQLite, com interface web.

## Como executar

Requer Node.js 22.8 ou superior.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000 para cadastrar, listar, editar e excluir produtos.

O banco é criado automaticamente em `data/produtos.sqlite`. Os dados permanecem após reiniciar.

## Testes

```sh
npm test
```

Jest testa o CRUD com um banco isolado. Cobertura mínima: 91% em linhas, funções, instruções e ramificações. Relatório: `coverage/index.html`.

Resultado: 27 testes aprovados, 100% das linhas e 95,34% das ramificações da API. O arquivo de inicialização do servidor não entra na medição.

## Rotas

- `GET /produtos` — listar produtos
- `GET /produtos/:id` — buscar produto
- `POST /produtos` — criar produto
- `PUT /produtos/:id` — atualizar produto
- `DELETE /produtos/:id` — excluir produto

Exemplo para criar um produto:

```json
{ "nome": "Teclado", "preco": 180 }
```

O nome deve ter de 1 a 100 caracteres e o preço deve ser maior ou igual a zero.
