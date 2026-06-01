import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import mongoose from "mongoose";
import argon2 from "argon2";
import "../models/Usuarios.js";

const Usuario = mongoose.model("usuarios");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "senha" },

    async (email, senha, done) => {
      try {
        const usuario = await Usuario.findOne({
          email: email.trim().toLowerCase(),
        });

        if (!usuario) {
          return done(null, false, { message: "Email ou senha invalidos" });
        }

        const senhaValida = await argon2.verify(usuario.senha, senha);

        if (!senhaValida) {
          return done(null, false, { message: "Email ou senha invalidos" });
        }

        return done(null, usuario);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await Usuario.findById(id);
    done(null, usuario);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
