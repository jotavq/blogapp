import * as postagensService from "../services/postagens.service.js";
import * as categoriaService from "../services/categoria.service.js";

export const adminHome = async (req, res) => {
  try {
    const totalPostagens = await postagensService.contarTodas();
    const totalCategorias = await categoriaService.contarTodas();
    res.render("admin/index", { totalPostagens, totalCategorias });
  } catch (err) {
    req.flash("error_msg", "Erro ao carregar o painel");
    res.redirect("/");
  }
};

export const home = async (req, res) => {
  try {
    const postagens = await postagensService.listarRecentes();
    res.render("index", { postagens });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Ocorreu um erro interno.");
    res.redirect("/");
  }
};
