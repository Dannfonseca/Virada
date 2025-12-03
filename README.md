# Virada no Rio 🌊

Todo list em tempo real para planejar a virada de ano no Rio de Janeiro.

## 🚀 Stack

- **Frontend**: React + Vite + TailwindCSS + Three.js
- **Backend**: Node.js + Express + MongoDB + Socket.IO
- **Real-time**: Sincronização instantânea entre usuários

## 📦 Instalação

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Configure MONGODB_URI no arquivo .env

# Frontend
cd ../frontend
npm install
```

## 💻 Desenvolvimento

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🏗️ Deploy

### Build
```bash
cd frontend
npm run build
```

### Produção
```bash
cd backend
npm start
```

O backend serve o frontend em produção.

## 🌐 Deploy no Render

1. Configure variáveis de ambiente:
   - `MONGODB_URI`: Connection string do MongoDB
   - `NODE_ENV`: `production`

2. Build Command: `cd backend && npm install && cd ../frontend && npm install && npm run build`

3. Start Command: `cd backend && npm start`

## 🏥 Health Check

```
GET /health
```

## 📝 API

- `GET /api/items` - Listar itens
- `POST /api/items` - Criar item
- `PATCH /api/items/:id` - Atualizar item
- `DELETE /api/items/:id` - Deletar item

## ✨ Features

- ✅ CRUD completo
- ✅ Sincronização em tempo real
- ✅ 4 categorias (Praia, Night, Gastronomia, Turismo)
- ✅ Barra de progresso
- ✅ Animações 3D com Three.js
- ✅ Design glassmorphic
