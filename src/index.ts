import app from "./app";
import { conectarBanco } from "./database";

const port = Number(process.env.PORT ?? 3000);
conectarBanco().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}).catch((error: unknown) => {
  console.error("Não foi possível iniciar o servidor:", error);
  process.exitCode = 1;
});
