import mongoose from "mongoose";

export const conectarDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB conectado.");
};
