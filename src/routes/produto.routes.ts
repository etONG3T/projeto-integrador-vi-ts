import { Router } from "express";
import * as controller from "../controllers/produto.controller";

const router = Router();
router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.post("/", controller.criar);

export default router;
