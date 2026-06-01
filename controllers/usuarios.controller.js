import mongoose from "mongoose";
import argon2 from "argon2";
import "../models/Usuarios.js";
import passport from "passport";

const Usuario = mongoose.model("usuarios");

export const registrarUsuario = (req, res) => {
  res.render("usuarios/registro");
};

export const validarUsuarios = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const senha = req.body.senha?.trim();
  const senha2 = req.body.senha2?.trim();
  const nome = req.body.nome?.trim();

  let erros = [];
  // validação email
  if (!email) {
    erros.push({ texto: "Informe um email" });
  } else if (!email.includes("@")) {
    erros.push({ texto: "Email inválido" });
  }
  // validação senha
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
  // validação nome
  if (!nome) {
    erros.push({ texto: "Nome Invalido" });
  } else if (nome.length < 3) {
    erros.push({ texto: "O nome deve conter pelo menos 3 carecteres" });
  }

  if (erros.length > 0) {
    return res.render("usuarios/registro", { erros });
  }

  try {
    const usuarios = await Usuario.findOne({ email });

    if (usuarios) {
      req.flash(
        "error_msg",
        "Ja existe uma conta com esse e-email no nosso sistema.",
      );
      return res.redirect("/usuario/registro");
    } else {
      const senhaHash = await argon2.hash(senha);
      const novoUsuario = new Usuario({
        nome: nome,
        email: email,
        senha: senhaHash,
      });
      await novoUsuario.save();
      req.flash("success_msg", "Conta criada com sucesso!");
      return res.redirect("/usuario/registro");
    }
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Houve um erro interno.");
    return res.redirect("/");
  }
};

export const loginUsuario = (req, res) => {
  res.render("usuarios/login");
};

export const autenticarLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuario/login",
    failureFlash: true,
  })(req, res, next);
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "Você saiu da sua conta.");
    res.redirect("/");
  });
};
