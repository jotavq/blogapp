import mongoose from "mongoose";
import "../models/Postagem.js";
import "../models/Categoria.js";

const Postagem = mongoose.model("postagens");
const Categoria = mongoose.model("categorias");

export const adminHome = async (req, res) => {
  try {
    const totalPostagens = await Postagem.countDocuments();
    const totalCategorias = await Categoria.countDocuments();
    res.render("admin/index", { totalPostagens, totalCategorias });
  } catch (err) {
    req.flash("error_msg", "Erro ao carregar o painel");
    res.redirect("/");
  }
};

export const home = async (req, res) => {
  try {
    const postagens = await Postagem.find()
      .populate("categoria")
      .sort({ date: -1 })
      .lean();
    res.render("index", { postagens });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ocorreu um erro interno.");
    res.redirect("/");
  }
};
