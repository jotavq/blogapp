import express from "express";
import { estaAutenticado } from "../helpers/eAdmin.js";
import { home } from "../controllers/admin.controller.js";
import {
  buscarPostagem,
  likePostagem,
} from "../controllers/postagens.Controller.js";
import {
  buscarCategorias,
  listarCategoriasPublica,
} from "../controllers/categoria.Controller.js";

const router = express.Router();

router.get("/", home);
router.get("/postagens/:slug", estaAutenticado, buscarPostagem);
router.get("/categorias", estaAutenticado, listarCategoriasPublica);
router.get("/categorias/:slug", estaAutenticado, buscarCategorias);

router.post("/postagens/:slug/like", estaAutenticado, likePostagem);

export default router;
