import express from "express";
import produtoRoutes from "./routes/produto.routes";

const app = express();
app.use(express.json());
app.use("/produtos", produtoRoutes);

export default app;
