import mongoose from "mongoose";
import argon2 from "argon2";
import "../models/Usuarios.js";

const Usuario = mongoose.model("usuarios");

function validarDados({ email, senha, senha2, nome }) {
  const erros = [];

  if (!email) {
    erros.push({ texto: "Informe um email" });
  } else if (!email.includes("@")) {
    erros.push({ texto: "Email inválido" });
  }

  if (!senha) {
    erros.push({ texto: "Senha inválida" });
  } else {
    if (senha.length < 8)
      erros.push({ texto: "A senha deve ter pelo menos 8 caracteres" });
    if (!/[A-Z]/.test(senha))
      erros.push({
        texto: "A senha deve conter pelo menos uma letra maiúscula",
      });
    if (!/[a-z]/.test(senha))
      erros.push({
        texto: "A senha deve conter pelo menos uma letra minúscula",
      });
    if (!/[0-9]/.test(senha))
      erros.push({ texto: "A senha deve conter pelo menos um número" });
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha))
      erros.push({
        texto: "A senha deve conter pelo menos um caractere especial",
      });

    if (!senha2) {
      erros.push({ texto: "Confirme sua senha" });
    } else if (senha !== senha2) {
      erros.push({ texto: "As senhas são diferentes, tente novamente." });
    }
  }

  if (!nome) {
    erros.push({ texto: "Nome Invalido" });
  } else if (nome.length < 3) {
    erros.push({ texto: "O nome deve conter pelo menos 3 carecteres" });
  }

  return erros;
}

export const registrar = async ({ email, senha, senha2, nome }) => {
  const erros = validarDados({ email, senha, senha2, nome });
  if (erros.length > 0) return { erros };

  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) {
    return { emailEmUso: true };
  }

  const senhaHash = await argon2.hash(senha);
  const novoUsuario = new Usuario({ nome, email, senha: senhaHash });
  await novoUsuario.save();
  return { usuario: novoUsuario };
};
