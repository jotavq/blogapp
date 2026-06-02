# BlogStack

Sistema de blog fullstack desenvolvido com Node.js, Express, MongoDB e Bootstrap.

## 🚀 Demo

[blogstack-364b.onrender.com](https://blogstack-364b.onrender.com)

## 📋 Funcionalidades

- Autenticação de usuários com Passport.js e criptografia Argon2
- Painel administrativo protegido por nível de acesso
- CRUD completo de postagens e categorias
- Upload de imagens com Multer
- Sistema de likes nas postagens
- Flash messages para feedback ao usuário
- Rate limiting no login para proteção contra força bruta
- Layout responsivo com Bootstrap 5

## 🛠 Tecnologias

- **Back-end:** Node.js, Express.js
- **Banco de dados:** MongoDB, Mongoose
- **Autenticação:** Passport.js, Argon2
- **Template engine:** Handlebars
- **Front-end:** Bootstrap 5, Bootstrap Icons
- **Upload de arquivos:** Multer
- **Segurança:** Helmet, express-rate-limit, dotenv

## 📁 Estrutura do projeto

```
blogstack/
├── config/
│   ├── auth.js         # Configuração do Passport
│   ├── db.js           # Conexão com MongoDB
│   ├── multer.js       # Configuração de upload
│   └── rateLimit.js    # Rate limiting
├── controllers/
│   ├── admin.controller.js
│   ├── categoria.Controller.js
│   ├── postagens.Controller.js
│   └── usuarios.controller.js
├── helpers/
│   └── eAdmin.js       # Middlewares de autenticação
├── models/
│   ├── Categoria.js
│   ├── Postagem.js
│   └── Usuarios.js
├── public/
│   ├── css/
│   ├── js/
│   └── img/
├── routes/
│   ├── admin.js
│   ├── index.js
│   └── usuario.js
├── views/
│   ├── admin/
│   ├── categorias/
│   ├── layouts/
│   ├── partials/
│   ├── postagem/
│   └── usuarios/
└── app.js
```

## ⚙️ Como rodar localmente

**Pré-requisitos:** Node.js e MongoDB instalados

**1. Clone o repositório**
```bash
git clone https://github.com/jotavq/blogapp.git
cd blogapp
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```
SESSION_SECRET=sua_string_secreta
MONGO_URI=mongodb://localhost:27017/blogapp
PORT=8081
```

**4. Inicie o servidor**
```bash
npm run dev
```

Acesse `http://localhost:8081`

## 🔐 Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `SESSION_SECRET` | String secreta para sessões |
| `MONGO_URI` | URI de conexão com o MongoDB |
| `PORT` | Porta do servidor (padrão: 8081) |

## 👤 Autor

Desenvolvido por **João Victor**

[![GitHub](https://img.shields.io/badge/GitHub-jotavq-181717?style=flat&logo=github)](https://github.com/jotavq)
