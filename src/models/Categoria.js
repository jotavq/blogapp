import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Categoria = new Schema({
  nome: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  imagem: { type: String, default: "" },
});

mongoose.model("categorias", Categoria);
