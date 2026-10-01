# Projeto Integrador VI — TypeScript

Conversão da API de produtos de [projeto-integrador-6](https://github.com/etONG3T/projeto-integrador-6), baseada no commit `9be5fbe188d3b52f950a0f73f47377308169ea89`.

Express 5 com TypeScript em modo estrito. Modelos, serviços, controladores, rotas e inicialização estão em `src/`, exclusivamente em TypeScript.

## Executar

Requer Node.js 22.8 ou superior.

```sh
npm ci
npm run dev
```

O servidor atende em http://localhost:3000. A variável `PORT` permite alterar a porta.

Para executar o código compilado:

```sh
npm run build
npm start
```

## Verificar

```sh
npm run typecheck
npm test
npm run build
```

## Rotas

| Método | Rota | Resultado |
| --- | --- | --- |
| GET | `/produtos` | Lista os produtos (200) |
| GET | `/produtos/:id` | Consulta um produto (200 ou 404) |
| POST | `/produtos` | Cria um produto (201 ou 400) |

Exemplo de corpo para criação:

```json
{ "nome": "Teclado", "preco": 180 }
```

`nome` é um texto obrigatório e `preco` é um número obrigatório. As mensagens de erro usam o campo `mensagem`.

Os produtos permanecem em memória, como no projeto original: reiniciar o servidor restaura Notebook e Mouse. Não há banco de dados nem interface React no repositório original. Dependências e arquivos compilados não são versionados; `package-lock.json` fixa a instalação.
