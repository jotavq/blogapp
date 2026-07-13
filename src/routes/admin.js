import express from "express";
import { estaAutenticadoAdmin } from "../helpers/eAdmin.js";
import { adminHome } from "../controllers/admin.controller.js";
import {
  formPostagens,
  postagensAdd,
  newPostagem,
  formEditarPostagem,
  editarPostagem,
  deletarPostagem,
} from "../controllers/postagens.Controller.js";
import {
  listarCategorias,
  novaCategoria,
  criarCategoria,
  formEditar,
  editarCategoria,
  deletarCategoria,
} from "../controllers/categoria.Controller.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.use(estaAutenticadoAdmin);

router.get("/", adminHome);
router.get("/categorias", listarCategorias);
router.get("/categorias/add", novaCategoria);
router.get("/categorias/edit/:id", formEditar);
router.post("/categorias/edit", upload.single("imagem"), editarCategoria);
router.post("/categorias/deletar/:id", deletarCategoria);
router.post("/categorias/nova", upload.single("imagem"), criarCategoria);

// postagens

router.get("/postagens", formPostagens);
router.get("/postagens/add", postagensAdd);
router.get("/postagens/edit/:id", formEditarPostagem);
router.post("/postagens/nova", newPostagem);
router.post("/postagens/edit", editarPostagem);
router.post("/postagens/deletar/:id", deletarPostagem);

export default router;
