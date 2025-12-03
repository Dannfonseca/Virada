# 🌊 Virada no Rio - Planejador de Viagem

Um aplicativo React moderno e interativo para planejar sua virada de ano no Rio de Janeiro! Com animações em Three.js, design glassmórfico e integração com Firebase para sincronização em tempo real.

## ✨ Características

- 🎨 **Design Premium**: Interface glassmórfica com gradientes vibrantes e animações suaves
- 🌊 **Animação 3D**: Ondas do mar animadas usando Three.js com shaders customizados
- 🔥 **Firebase**: Sincronização em tempo real de dados
- 📱 **Responsivo**: Design mobile-first otimizado para todos os dispositivos
- 🎯 **Categorias**: Organize seus planos por Praia, Night Life, Gastronomia e Turismo
- ✅ **Rastreamento de Progresso**: Acompanhe o que já foi feito na sua viagem

## 🚀 Começando

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Uma conta Firebase (gratuita)

### Instalação

1. **Clone ou navegue até o diretório do projeto**

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**

   a. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   
   b. Ative o Firestore Database e Authentication (Anonymous)
   
   c. Copie as credenciais do seu projeto Firebase
   
   d. Crie um arquivo `.env` na raiz do projeto:
   ```bash
   cp .env.example .env
   ```
   
   e. Preencha o arquivo `.env` com suas credenciais do Firebase:
   ```env
   VITE_FIREBASE_API_KEY=sua_api_key_aqui
   VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu_projeto_id
   VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   VITE_APP_ID=virada-no-rio
   ```

4. **Configure as regras do Firestore**

   No Firebase Console, vá para Firestore Database > Rules e adicione:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /artifacts/{appId}/public/{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### Executando o Projeto

**Modo de Desenvolvimento:**
```bash
npm run dev
```
O aplicativo estará disponível em `http://localhost:3000`

**Build para Produção:**
```bash
npm run build
```

**Preview da Build de Produção:**
```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
Riodejaneiro/
├── src/
│   ├── components/
│   │   ├── AddModal.jsx       # Modal para adicionar novos itens
│   │   ├── NoiseOverlay.jsx   # Efeito de textura de ruído
│   │   ├── OceanWaves.jsx     # Animação 3D do oceano
│   │   ├── Sidebar.jsx        # Navegação lateral
│   │   └── VibeCard.jsx       # Card de item da viagem
│   ├── config/
│   │   ├── categories.js      # Configuração de categorias
│   │   └── firebase.js        # Configuração do Firebase
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Entry point do React
│   └── index.css              # Estilos globais e Tailwind
├── index.html                 # HTML principal
├── package.json               # Dependências do projeto
├── vite.config.js             # Configuração do Vite
├── tailwind.config.js         # Configuração do Tailwind CSS
└── .env.example               # Template de variáveis de ambiente
```

## 🎯 Como Usar

1. **Adicionar um Novo Rolé**: Clique no botão `+` no canto inferior direito
2. **Categorizar**: Escolha entre Praia & Sol, Night Life, Gastronomia ou Turismo
3. **Marcar como Concluído**: Clique no círculo ao lado do item
4. **Filtrar por Categoria**: Use o menu lateral para ver apenas uma categoria
5. **Excluir Item**: Clique no ícone de lixeira no card

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework UI
- **Vite** - Build tool e dev server
- **Firebase** - Backend e autenticação
- **Three.js** - Animações 3D
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Firestore** - Banco de dados em tempo real

## 🎨 Customização

### Modificar Categorias

Edite `src/config/categories.js` para adicionar ou modificar categorias.

### Ajustar Cores

As cores principais estão definidas usando classes do Tailwind CSS. Modifique `tailwind.config.js` para personalizar o tema.

### Animação do Oceano

Ajuste os parâmetros em `src/components/OceanWaves.jsx` para modificar a aparência das ondas.

## 📝 Licença

Este projeto é de código aberto e está disponível para uso pessoal.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Feito com 🧡 para o Verão 2025**
