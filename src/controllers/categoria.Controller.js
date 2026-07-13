import mongoose from "mongoose";
import * as categoriaService from "../services/categoria.service.js";

export const listarCategorias = async (req, res) => {
  try {
    const categorias = await categoriaService.listarTodas();
    res.render("admin/categorias", { categorias });
  } catch (err) {
    req.flash("error_msg", "Houve um erro ao listar as categorias");
    res.redirect("/admin");
  }
};

export const listarCategoriasPublica = async (req, res) => {
  try {
    const categorias = await categoriaService.listarTodas();
    res.render("categorias/index", { categorias });
  } catch (err) {
    req.flash("error_msg", "Erro ao listar categorias");
    res.redirect("/");
  }
};

export const novaCategoria = (req, res) => {
  res.render("admin/addcategorias");
};

export const criarCategoria = async (req, res) => {
  try {
    const nome = req.body.nome?.trim();
    const slug = req.body.slug?.trim().toLowerCase().replace(/\s+/g, "-");
    const imagem = req.file ? `/img/upload/${req.file.filename}` : "";

    const resultado = await categoriaService.criar({ nome, slug, imagem });
    if (resultado.erros) {
      return res.render("admin/addcategorias", { erros: resultado.erros });
    }

    req.flash("success_msg", "Categoria criada com sucesso!");
    res.redirect("/admin/categorias");
  } catch (err) {
    req.flash(
      "error_msg",
      "Houve um erro ao criar a categoria, tente novamente.",
    );
    console.error(err);
    res.redirect("/admin");
  }
};

export const formEditar = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      req.flash("error_msg", "ID inválido");
      return res.redirect("/admin/categorias");
    }

    const categoria = await categoriaService.buscarPorId(req.params.id);
    res.render("admin/editcategorias", { categoria });
  } catch (err) {
    req.flash("error_msg", "Essa categoria não existe");
    res.redirect("/admin/categorias");
  }
};

export const editarCategoria = async (req, res) => {
  try {
    const id = req.body.id;
    const nome = req.body.nome?.trim();
    const slug = req.body.slug?.trim().toLowerCase().replace(/\s+/g, "-");
    const imagem = req.file
      ? `/img/upload/${req.file.filename}`
      : req.body.imagemAtual;

    const resultado = await categoriaService.atualizar(id, {
      nome,
      slug,
      imagem,
    });
    if (resultado.erros) {
      return res.render("admin/editcategorias", {
        erros: resultado.erros,
        categoria: { _id: id, nome, slug },
      });
    }

    req.flash("success_msg", "Categoria editada com sucesso!");
    res.redirect("/admin/categorias");
  } catch (err) {
    req.flash(
      "error_msg",
      "Houve um erro ao editar a categoria, tente novamente.",
    );
    console.error(err);
    res.redirect("/admin/categorias");
  }
};

export const deletarCategoria = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      req.flash("error_msg", "ID inválido");
      return res.redirect("/admin/categorias");
    }

    await categoriaService.deletar(req.params.id);
    req.flash("success_msg", "Categoria deletada com sucesso!");
    res.redirect("/admin/categorias");
  } catch (err) {
    req.flash(
      "error_msg",
      "Houve um erro ao deletar a categoria, tente novamente.",
    );
    res.redirect("/admin/categorias");
    console.log(err);
  }
};

export const buscarCategorias = async (req, res) => {
  try {
    const resultado = await categoriaService.buscarPorSlugComPostagens(
      req.params.slug,
    );

    if (!resultado) {
      req.flash("error_msg", "Esta categoria não existe.");
      return res.redirect("/");
    }

    const { categoria, postagens } = resultado;
    return res.render("categorias/postagens", { postagens, categoria });
  } catch (err) {
    req.flash(
      "error_msg",
      "Houve um erro interno ao carregar a pagina desta categoria.",
    );
    res.redirect("/");
  }
};
