# Projeto Integrador VI — TypeScript

API de produtos feita com Node.js, Express e TypeScript.

## Como executar

Requer Node.js 22.8 ou superior.

```sh
npm ci
npm run dev
```

Servidor: http://localhost:3000

## Rotas

- `GET /produtos` — listar produtos
- `GET /produtos/:id` — buscar produto
- `POST /produtos` — criar produto

Exemplo para criar um produto:

```json
{ "nome": "Teclado", "preco": 180 }
```

Os dados ficam em memória e são perdidos ao reiniciar o servidor.
