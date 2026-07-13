import mongoose from "mongoose";
import "../models/Postagem.js";

const Postagem = mongoose.model("postagens");

function validarNova({ titulo, slug, descricao, conteudo, categoria }) {
  const erros = [];
  if (!titulo) erros.push({ texto: "Titulo Inválido" });
  if (!slug) erros.push({ texto: "Slug Inválido" });
  if (!descricao) erros.push({ texto: "Descrição Inválida" });
  if (!conteudo) erros.push({ texto: "Conteudo Inválido" });
  if (!categoria || categoria === "0")
    erros.push({ texto: "Categoria Inválida, registre  uma categoria" });
  return erros;
}

function validarEdicao({ titulo, slug, descricao, conteudo }) {
  const erros = [];
  if (!titulo) erros.push({ texto: "Titulo Inválido" });
  if (!slug) erros.push({ texto: "Slug Inválido" });
  if (!descricao) erros.push({ texto: "Descrição Inválida" });
  if (!conteudo) erros.push({ texto: "Conteudo Inválido" });
  return erros;
}

export const contarTodas = () => Postagem.countDocuments();

export const listarTodas = () => Postagem.find().populate("categoria").lean();

export const listarRecentes = () =>
  Postagem.find().populate("categoria").sort({ date: -1 }).lean();

export const criar = async (dados) => {
  const erros = validarNova(dados);
  if (erros.length > 0) return { erros };

  const slugExiste = await Postagem.findOne({ slug: dados.slug });
  if (slugExiste) {
    return { erros: [{ texto: "Já existe uma postagem com esse slug" }] };
  }

  const postagem = await new Postagem(dados).save();
  return { postagem };
};

export const buscarPorId = (id) =>
  Postagem.findOne({ _id: id }).populate("categoria").lean();

export const atualizar = async (id, dados) => {
  const erros = validarEdicao(dados);
  if (erros.length > 0) return { erros };

  const slugExiste = await Postagem.findOne({
    slug: dados.slug,
    _id: { $ne: id },
  });
  if (slugExiste) {
    return { erros: [{ texto: "Já existe uma postagem com esse slug" }] };
  }

  await Postagem.findOneAndUpdate({ _id: id }, dados);
  return {};
};

export const deletar = (id) => Postagem.deleteOne({ _id: id });

export const buscarPorSlug = (slug) =>
  Postagem.findOne({ slug }).populate("categoria").lean();

export const alternarLike = async (slug, usuarioId) => {
  const postagem = await Postagem.findOne({ slug });
  if (!postagem) return null;

  const jaLikeu = postagem.likes.includes(usuarioId);
  if (jaLikeu) {
    await Postagem.findByIdAndUpdate(postagem._id, {
      $pull: { likes: usuarioId },
    });
  } else {
    await Postagem.findByIdAndUpdate(postagem._id, {
      $push: { likes: usuarioId },
    });
  }
  return postagem;
};
