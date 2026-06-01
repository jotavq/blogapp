import mongoose from "mongoose";
import "../models/Categoria.js";
import "../models/Postagem.js";

const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens");

// Listar Categorias Admin
export const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ date: -1 }).lean();
    res.render("admin/categorias", { categorias });
  } catch (err) {
    req.flash("error_msg", "Houve um erro ao listar as categorias");
    res.redirect("/admin");
  }
};

// Listar Categorias Publica
export const listarCategoriasPublica = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ date: -1 }).lean();
    res.render("categorias/index", { categorias });
  } catch (err) {
    req.flash("error_msg", "Erro ao listar categorias");
    res.redirect("/");
  }
};

// Formulario de Nova Categoria
export const novaCategoria = (req, res) => {
  res.render("admin/addcategorias");
};

//Criar Categoria
export const criarCategoria = async (req, res) => {
  try {
    const nome = req.body.nome?.trim();
    const slug = req.body.slug?.trim().toLowerCase().replace(/\s+/g, "-");
    const imagem = req.file ? `/img/upload/${req.file.filename}` : "";

    let erros = [];
    if (!nome) erros.push({ texto: "Nome inválido" });
    if (!slug) erros.push({ texto: "Slug inválido" });
    if (nome && nome.length < 3) erros.push({ texto: "Nome muito pequeno" });

    if (erros.length > 0)
      return res.render("admin/addcategorias", { erros: erros });

    const slugExiste = await Categoria.findOne({ slug });
    if (slugExiste) {
      erros.push({ texto: "Já existe uma categoria com esse slug" });
      return res.render("admin/addcategorias", { erros });
    }

    await new Categoria({ nome, slug, imagem }).save();
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

// Formulario de Editar Categoria
export const formEditar = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      req.flash("error_msg", "ID inválido");
      return res.redirect("/admin/categorias");
    }

    const categoria = await Categoria.findOne({ _id: req.params.id }).lean();
    res.render("admin/editcategorias", { categoria });
  } catch (err) {
    req.flash("error_msg", "Essa categoria não existe");
    res.redirect("/admin/categorias");
  }
};

// Editar Categoria
export const editarCategoria = async (req, res) => {
  try {
    const id = req.body.id;
    const nome = req.body.nome?.trim();
    const slug = req.body.slug?.trim().toLowerCase().replace(/\s+/g, "-");
    const imagem = req.file
      ? `/img/upload/${req.file.filename}`
      : req.body.imagemAtual;

    let erros = [];
    if (!nome) erros.push({ texto: "Nome inválido" });
    if (!slug) erros.push({ texto: "Slug inválido" });
    if (nome && nome.length < 3) erros.push({ texto: "Nome muito pequeno" });

    if (erros.length > 0)
      return res.render("admin/editcategorias", {
        erros: erros,
        categoria: { _id: id, nome, slug },
      });

    const slugExiste = await Categoria.findOne({ slug, _id: { $ne: id } });
    if (slugExiste) {
      erros.push({ texto: "Já existe uma categoria com esse slug" });
      return res.render("admin/editcategorias", {
        erros,
        categoria: { _id: id, nome, slug },
      });
    }

    await Categoria.findOneAndUpdate({ _id: id }, { nome, slug, imagem });
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

// Deletar Categoria
export const deletarCategoria = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      req.flash("error_msg", "ID inválido");
      return res.redirect("/admin/categorias");
    }

    await Categoria.deleteOne({ _id: req.params.id });
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

// Buscar Categorias

export const buscarCategorias = async (req, res) => {
  try {
    const categoria = await Categoria.findOne({ slug: req.params.slug }).lean();

    if (!categoria) {
      req.flash("error_msg", "Esta categoria não existe.");
      return res.redirect("/");
    }

    const postagens = await Postagem.find({ categoria: categoria._id }).lean();
    return res.render("categorias/postagens", { postagens, categoria });
  } catch (err) {
    req.flash(
      "error_msg",
      "Houve um erro interno ao carregar a pagina desta categoria.",
    );
    res.redirect("/");
  }
};
