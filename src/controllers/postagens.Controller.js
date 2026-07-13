import mongoose from "mongoose";
import * as postagensService from "../services/postagens.service.js";
import "../models/Categoria.js";

const Categoria = mongoose.model("categorias");

export const formPostagens = async (req, res) => {
  try {
    const postagens = await postagensService.listarTodas();
    res.render("admin/postagens", { postagens });
  } catch (err) {
    req.flash("error_msg", "Houve um erro ao listar as postagens");
    console.log(err);
    res.redirect("/admin");
  }
};

export const postagensAdd = async (req, res) => {
  try {
    const categorias = await Categoria.find().lean();
    res.render("admin/addpostagens", { categorias });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Houve um erro ao carregar o Formulario");
    res.redirect("/admin");
  }
};

export const newPostagem = async (req, res) => {
  try {
    const titulo = req.body.titulo?.trim();
    const slug = req.body.slug?.trim().toLowerCase().replace(/\s+/g, "-");
    const descricao = req.body.descricao?.trim();
    const conteudo = req.body.conteudo?.trim();
    const categoria = req.body.categoria;

    const resultado = await postagensService.criar({
      titulo,
      slug,
      descricao,
      conteudo,
      categoria,
    });

    if (resultado.erros) {
      const categorias = await Categoria.find().lean();
      return res.render("admin/addpostagens", {
        erros: resultado.erros,
        categorias,
      });
    }

    req.flash("success_msg", "Postagem criada com sucesso!");
    res.redirect("/admin/postagens");
  } catch (err) {
    req.flash(
      "error_msg",
      "Houve um erro ao criar a postagem, tente novamente.",
    );
    console.log(err);
    res.redirect("/admin/postagens");
  }
};

export const formEditarPostagem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      req.flash("error_msg", "ID inválido");
      return res.redirect("/admin/postagens");
    }

    const postagem = await postagensService.buscarPorId(req.params.id);
    const categorias = await Categoria.find().lean();
    res.render("admin/editpostagens", { postagem, categorias });
  } catch (err) {
    req.flash("error_msg", "Essa postagem não existe");
    res.redirect("/admin/postagens");
  }
};

export const editarPostagem = async (req, res) => {
  try {
    const id = req.body.id;
    const titulo = req.body.titulo?.trim();
    const slug = req.body.slug?.trim().toLowerCase().replace(/\s+/g, "-");
    const descricao = req.body.descricao?.trim();
    const conteudo = req.body.conteudo?.trim();
    const categoria = req.body.categoria;

    const resultado = await postagensService.atualizar(id, {
      titulo,
      slug,
      descricao,
      conteudo,
      categoria,
    });

    if (resultado.erros) {
      const categorias = await Categoria.find().lean();
      return res.render("admin/editpostagens", {
        erros: resultado.erros,
        postagem: { _id: id, titulo, slug, descricao, conteudo, categoria },
        categorias,
      });
    }

    req.flash("success_msg", "Postagem editada com sucesso!");
    res.redirect("/admin/postagens");
  } catch (err) {
    console.log(err);
    req.flash(
      "error_msg",
      "Houve um erro ao editar a postagem, tente novamente.",
    );
    res.redirect("/admin/postagens");
  }
};

export const deletarPostagem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      req.flash("error_msg", "ID inválido");
      return res.redirect("/admin/postagens");
    }

    await postagensService.deletar(req.params.id);
    req.flash("success_msg", "Postagem deleta com sucesso!");
    res.redirect("/admin/postagens");
  } catch (err) {
    req.flash(
      "error_msg",
      "Houve um erro ao deletar a postagem, tente novamente.",
    );
    res.redirect("/admin/postagens");
    console.log(err);
  }
};

export const buscarPostagem = async (req, res) => {
  try {
    const postagem = await postagensService.buscarPorSlug(req.params.slug);

    if (!postagem) {
      req.flash("error_msg", "Esta postagem não existe");
      return res.redirect("/");
    }

    const jaLikeu = req.user
      ? postagem.likes
          .map((id) => id.toString())
          .includes(req.user._id.toString())
      : false;

    res.render("postagem/index", { postagem, jaLikeu });
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Houve um erro interno");
    res.redirect("/");
  }
};

export const likePostagem = async (req, res) => {
  try {
    const postagem = await postagensService.alternarLike(
      req.params.slug,
      req.user._id,
    );

    if (!postagem) {
      req.flash("error_msg", "Postagem não encontrada.");
      return res.redirect("/");
    }

    res.redirect(`/postagens/${req.params.slug}`);
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Erro ao processar o like.");
    res.redirect("/");
  }
};
