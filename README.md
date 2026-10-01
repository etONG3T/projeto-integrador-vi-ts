# Projeto Integrador VI — TypeScript

CRUD de produtos com TypeScript, Express, Sequelize e SQLite, com interface web.

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

## Testes

Execute `npm test`. Os 27 testes com Jest passaram: 100% das linhas e 95,34% das ramificações da API. A cobertura mínima exigida é 91%; a inicialização do servidor não entra na medição.
