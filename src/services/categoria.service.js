import mongoose from "mongoose";
import "../models/Categoria.js";
import "../models/Postagem.js";

const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens");

function validarCategoria(nome, slug) {
  const erros = [];
  if (!nome) erros.push({ texto: "Nome inválido" });
  if (!slug) erros.push({ texto: "Slug inválido" });
  if (nome && nome.length < 3) erros.push({ texto: "Nome muito pequeno" });
  return erros;
}

export const contarTodas = () => Categoria.countDocuments();

export const listarTodas = () => Categoria.find().sort({ date: -1 }).lean();

export const criar = async ({ nome, slug, imagem }) => {
  const erros = validarCategoria(nome, slug);
  if (erros.length > 0) return { erros };

  const slugExiste = await Categoria.findOne({ slug });
  if (slugExiste) {
    return { erros: [{ texto: "Já existe uma categoria com esse slug" }] };
  }

  const categoria = await new Categoria({ nome, slug, imagem }).save();
  return { categoria };
};

export const buscarPorId = (id) => Categoria.findOne({ _id: id }).lean();

export const atualizar = async (id, { nome, slug, imagem }) => {
  const erros = validarCategoria(nome, slug);
  if (erros.length > 0) return { erros };

  const slugExiste = await Categoria.findOne({ slug, _id: { $ne: id } });
  if (slugExiste) {
    return { erros: [{ texto: "Já existe uma categoria com esse slug" }] };
  }

  await Categoria.findOneAndUpdate({ _id: id }, { nome, slug, imagem });
  return {};
};

export const deletar = (id) => Categoria.deleteOne({ _id: id });

export const buscarPorSlugComPostagens = async (slug) => {
  const categoria = await Categoria.findOne({ slug }).lean();
  if (!categoria) return null;

  const postagens = await Postagem.find({ categoria: categoria._id }).lean();
  return { categoria, postagens };
};
