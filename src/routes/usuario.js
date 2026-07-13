import express from "express";
import { loginLimiter } from "../config/rateLimit.js";
import {
  autenticarLogin,
  loginUsuario,
  logout,
  registrarUsuario,
  validarUsuarios,
} from "../controllers/usuarios.controller.js";

const router = express.Router();

router.get("/registro", registrarUsuario);
router.post("/registro", validarUsuarios);

router.get("/login", loginUsuario);
router.post("/login", loginLimiter, autenticarLogin);

router.get("/logout", logout);
export default router;
