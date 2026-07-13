import app from "./app.js";
import { conectarDB } from "./config/db.js";

const PORT = process.env.PORT || 8081;

async function start() {
  try {
    await conectarDB();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao conectar no mongoDB:", err);
    process.exit(1);
  }
}
start();
