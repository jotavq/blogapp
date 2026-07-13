import passport from "passport";
import * as usuariosService from "../services/usuarios.service.js";

export const registrarUsuario = (req, res) => {
  res.render("usuarios/registro");
};

export const validarUsuarios = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const senha = req.body.senha?.trim();
  const senha2 = req.body.senha2?.trim();
  const nome = req.body.nome?.trim();

  try {
    const resultado = await usuariosService.registrar({
      email,
      senha,
      senha2,
      nome,
    });

    if (resultado.erros) {
      return res.render("usuarios/registro", { erros: resultado.erros });
    }

    if (resultado.emailEmUso) {
      req.flash(
        "error_msg",
        "Ja existe uma conta com esse e-email no nosso sistema.",
      );
      return res.redirect("/usuario/registro");
    }

    req.flash("success_msg", "Conta criada com sucesso!");
    return res.redirect("/usuario/registro");
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
