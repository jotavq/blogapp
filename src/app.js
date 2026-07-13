import express from "express";
import "dotenv/config";
import helmet from "helmet";
import { engine } from "express-handlebars";
import index from "./routes/index.js";
import admin from "./routes/admin.js";
import usuario from "./routes/usuario.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash";
import passport from "./config/auth.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const Categoria = mongoose.model("categorias");

// configurações
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
app.use(async (req, res, next) => {
  try {
    const categorias = await Categoria.find().lean();
    res.locals.categorias = categorias;
  } catch (err) {
    res.locals.categorias = [];
  }
  next();
});

// Handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      formatDate: function (date) {
        return new Date(date).toLocaleDateString("pt-BR");
      },
      eq: function (a, b) {
        return a?.toString() === b?.toString();
      },
      currentYear: function () {
        return new Date().getFullYear();
      },
      primeiroNome: function (nome) {
        return nome ? nome.split(" ")[0] : "";
      },
    },
  }),
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "..", "views"));

// public
app.use(express.static(path.join(__dirname, "..", "public")));

// rotas
app.use("/", index);
app.use("/admin", admin);
app.use("/usuario", usuario);

export default app;
