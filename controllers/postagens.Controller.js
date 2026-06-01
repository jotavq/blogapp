import mongoose from "mongoose";
import "../models/Postagem.js";
import "../models/Categoria.js";

const Postagem = mongoose.model("postagens");
const Categoria = mongoose.model("categorias");

export const formPostagens = async (req, res) => {
  try {
    const postagens = await Postagem.find().populate("categoria").lean();
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

    let erros = [];
    if (!titulo) erros.push({ texto: "Titulo Inválido" });
    if (!slug) erros.push({ texto: "Slug Inválido" });
    if (!descricao) erros.push({ texto: "Descrição Inválida" });
    if (!conteudo) erros.push({ texto: "Conteudo Inválido" });
    if (!categoria || categoria === "0")
      erros.push({ texto: "Categoria Inválida, registre  uma categoria" });

    if (erros.length > 0) {
      const categorias = await Categoria.find().lean();
      return res.render("admin/addpostagens", { erros, categorias });
    }
    const slugExiste = await Postagem.findOne({ slug });
    if (slugExiste) {
      const categorias = await Categoria.find().lean();
      erros.push({ texto: "Já existe uma postagem com esse slug" });
      return res.render("admin/addpostagens", { erros, categorias });
    }

    await new Postagem({ titulo, slug, descricao, conteudo, categoria }).save();
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

    const postagem = await Postagem.findOne({ _id: req.params.id })
      .populate("categoria")
      .lean();
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

    let erros = [];
    if (!titulo) erros.push({ texto: "Titulo Inválido" });
    if (!slug) erros.push({ texto: "Slug Inválido" });
    if (!descricao) erros.push({ texto: "Descrição Inválida" });
    if (!conteudo) erros.push({ texto: "Conteudo Inválido" });

    if (erros.length > 0) {
      const categorias = await Categoria.find().lean();

      return res.render("admin/editpostagens", {
        erros,
        postagem: { _id: id, titulo, slug, descricao, conteudo, categoria },
        categorias,
      });
    }

    const slugExiste = await Postagem.findOne({ slug, _id: { $ne: id } });
    if (slugExiste) {
      const categorias = await Categoria.find().lean();
      erros.push({ texto: "Já existe uma postagem com esse slug" });
      return res.render("admin/editpostagens", {
        erros,
        postagem: { _id: id, titulo, slug, descricao, conteudo, categoria },
        categorias,
      });
    }

    await Postagem.findOneAndUpdate(
      { _id: id },
      { titulo, slug, descricao, conteudo, categoria },
    );
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

    await Postagem.deleteOne({ _id: req.params.id });
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
    const postagem = await Postagem.findOne({ slug: req.params.slug })
      .populate("categoria")
      .lean();

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
    const postagem = await Postagem.findOne({ slug: req.params.slug });

    if (!postagem) {
      req.flash("error_msg", "Postagem não encontrada.");
      return res.redirect("/");
    }

    const usuarioId = req.user._id;
    const jaLikeu = postagem.likes.includes(usuarioId);

    if (jaLikeu) {
      // remove o like da postagem
      await Postagem.findByIdAndUpdate(postagem._id, {
        $pull: { likes: usuarioId },
      });
    } else {
      // adiciona o like na postagem
      await Postagem.findByIdAndUpdate(postagem._id, {
        $push: { likes: usuarioId },
      });
    }

    res.redirect(`/postagens/${req.params.slug}`);
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Erro ao processar o like.");
    res.redirect("/");
  }
};
