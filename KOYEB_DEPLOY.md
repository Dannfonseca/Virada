# 🚀 Deploy no Koyeb - Virada no Rio

Guia completo para fazer deploy do projeto **Virada no Rio** no Koyeb - plataforma gratuita **SEM COLD START**!

## 📋 Pré-requisitos

- ✅ Conta no GitHub com o repositório do projeto
- ✅ Conta no MongoDB Atlas (gratuita)
- ✅ Conta no Koyeb (criar em https://koyeb.com)

---

## 🎯 Visão Geral

O Koyeb permite deploy de aplicações fullstack gratuitamente. Vamos fazer deploy de:
- **Backend**: Node.js + Express + Socket.IO
- **Frontend**: React + Vite (build estático servido pelo backend)

---

## 📦 Passo 1: Preparar o Projeto

### 1.1 Verificar Scripts no package.json

Certifique-se de que o arquivo raiz `package.json` tem os scripts corretos:

```json
{
  "scripts": {
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install",
    "build:frontend": "cd frontend && npm install && npm run build",
    "start": "cd backend && npm start"
  }
}
```

### 1.2 Verificar Backend package.json

O arquivo `backend/package.json` deve ter:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

### 1.3 Criar arquivo .koyeb/build.sh (Opcional)

Crie uma pasta `.koyeb` na raiz do projeto e adicione `build.sh`:

```bash
#!/bin/bash
# Install all dependencies
npm install
cd backend && npm install
cd ../frontend && npm install && npm run build
```

Torne o arquivo executável:
```bash
chmod +x .koyeb/build.sh
```

---

## 🗄️ Passo 2: Configurar MongoDB Atlas

### 2.1 Criar Cluster (se ainda não tiver)

1. Acesse https://cloud.mongodb.com
2. Crie um cluster gratuito (M0)
3. Em **Database Access**, crie um usuário com senha
4. Em **Network Access**, adicione `0.0.0.0/0` (permitir de qualquer lugar)

### 2.2 Obter Connection String

1. Clique em **Connect** no seu cluster
2. Escolha **Connect your application**
3. Copie a connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/virada-no-rio?retryWrites=true&w=majority
   ```
4. Substitua `<username>` e `<password>` pelos seus dados

---

## 🚀 Passo 3: Deploy no Koyeb

### 3.1 Criar Conta no Koyeb

1. Acesse https://app.koyeb.com/auth/signup
2. Crie uma conta (pode usar GitHub)
3. Confirme seu email

### 3.2 Conectar GitHub ao Koyeb

1. No dashboard do Koyeb, clique em **Create App**
2. Escolha **GitHub** como fonte
3. Autorize o Koyeb a acessar seus repositórios
4. Selecione o repositório **Virada**

### 3.3 Configurar o Serviço

#### Builder Settings:
- **Build command**: 
  ```bash
  npm install && cd backend && npm install && cd ../frontend && npm install && npm run build
  ```
- **Run command**: 
  ```bash
  cd backend && npm start
  ```

#### Instance Settings:
- **Instance type**: Free (Eco)
- **Regions**: Escolha a mais próxima (ex: Frankfurt, Washington)
- **Port**: `5000` (ou a porta que seu backend usa)

#### Environment Variables:

Adicione as seguintes variáveis de ambiente:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `NODE_ENV` | `production` | Ambiente de produção |
| `PORT` | `5000` | Porta do servidor |
| `MONGODB_URI` | `mongodb+srv://...` | Sua connection string do MongoDB |
| `FRONTEND_URL` | `https://seu-app.koyeb.app` | URL do frontend (será gerada) |

> **⚠️ IMPORTANTE**: Você precisará atualizar `FRONTEND_URL` depois que o deploy for concluído!

### 3.4 Configurar Domínio

1. Após o primeiro deploy, copie a URL gerada (ex: `https://virada-no-rio-dannfonseca.koyeb.app`)
2. Volte em **Settings** > **Environment Variables**
3. Atualize `FRONTEND_URL` com a URL gerada
4. Clique em **Redeploy** para aplicar as mudanças

---

## 🔧 Passo 4: Configurar CORS no Backend

Verifique se o arquivo `backend/server.js` está configurado corretamente:

```javascript
const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? process.env.FRONTEND_URL
            : ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
});

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : '*'
}));
```

---

## 🔐 Passo 5: Configurar Google OAuth (Opcional)

Se você usa Google OAuth, atualize as URLs autorizadas:

1. Acesse https://console.cloud.google.com
2. Vá em **APIs & Services** > **Credentials**
3. Edite seu OAuth 2.0 Client ID
4. Adicione em **Authorized JavaScript origins**:
   ```
   https://seu-app.koyeb.app
   ```
5. Adicione em **Authorized redirect URIs**:
   ```
   https://seu-app.koyeb.app
   https://seu-app.koyeb.app/auth/callback
   ```

---

## ✅ Passo 6: Verificar Deploy

### 6.1 Monitorar Build

1. No dashboard do Koyeb, vá em **Deployments**
2. Acompanhe os logs em tempo real
3. Aguarde até ver "Healthy" ✅

### 6.2 Testar Aplicação

1. Clique na URL gerada
2. Verifique se o frontend carrega
3. Teste adicionar/editar/deletar itens
4. Verifique se os comentários funcionam
5. Abra em duas abas e teste sincronização em tempo real

### 6.3 Verificar Logs

Se algo não funcionar:
1. Vá em **Logs** no dashboard
2. Procure por erros
3. Verifique se as variáveis de ambiente estão corretas

---

## 🔄 Passo 7: Configurar Auto-Deploy

O Koyeb já configura auto-deploy por padrão!

Sempre que você fizer `git push` para o GitHub:
1. Koyeb detecta as mudanças
2. Faz rebuild automático
3. Deploy da nova versão

Para desabilitar (se quiser):
1. Vá em **Settings** > **General**
2. Desmarque **Auto-deploy**

---

## 🎨 Passo 8: Domínio Personalizado (Opcional)

### 8.1 Adicionar Domínio Próprio

1. No Koyeb, vá em **Settings** > **Domains**
2. Clique em **Add domain**
3. Digite seu domínio (ex: `viradanorio.com`)
4. Siga as instruções para configurar DNS

### 8.2 Configurar DNS

No seu provedor de domínio (GoDaddy, Namecheap, etc):

**Tipo A Record:**
```
@ -> IP fornecido pelo Koyeb
```

**Tipo CNAME:**
```
www -> seu-app.koyeb.app
```

---

## 🐛 Troubleshooting

### Problema: Build falha

**Solução:**
- Verifique os logs de build
- Certifique-se de que todos os `package.json` estão corretos
- Teste o build localmente: `npm run build:frontend`

### Problema: App não conecta ao MongoDB

**Solução:**
- Verifique se `MONGODB_URI` está correta
- Confirme que o IP `0.0.0.0/0` está permitido no MongoDB Atlas
- Verifique se o usuário/senha estão corretos

### Problema: Socket.IO não funciona

**Solução:**
- Verifique se `FRONTEND_URL` está configurada corretamente
- Confirme que CORS está permitindo a origem correta
- Verifique logs do backend para erros de conexão

### Problema: Frontend mostra página em branco

**Solução:**
- Verifique se o build do frontend foi concluído
- Confirme que `backend/server.js` está servindo arquivos estáticos
- Verifique o caminho: `app.use(express.static(join(__dirname, '../frontend/dist')))`

---

## 📊 Monitoramento

### Métricas Disponíveis

No dashboard do Koyeb você pode ver:
- **CPU Usage**: Uso de processador
- **Memory Usage**: Uso de memória
- **Request Rate**: Requisições por segundo
- **Response Time**: Tempo de resposta

### Alertas

Configure alertas em **Settings** > **Notifications** para:
- Deploy failures
- High CPU/Memory usage
- Downtime

---

## 💰 Limites do Plano Gratuito

O plano gratuito do Koyeb inclui:

✅ **1 Web Service** (seu fullstack app)  
✅ **1 Worker Service** (se precisar)  
✅ **Sem cold start** - app sempre ativo!  
✅ **SSL/HTTPS gratuito**  
✅ **Auto-deploy do GitHub**  
✅ **Logs em tempo real**  

❌ **Limitações:**
- 512 MB RAM
- 0.1 vCPU
- Sem custom domains no free tier
- 100 GB bandwidth/mês

---

## 🎉 Pronto!

Seu app está no ar 24/7 sem cold start! 🚀

**URL do seu app:** `https://seu-app.koyeb.app`

### Próximos Passos

1. ✅ Compartilhe a URL com amigos
2. ✅ Configure domínio personalizado (opcional)
3. ✅ Monitore métricas no dashboard
4. ✅ Continue desenvolvendo - auto-deploy está ativo!

---

## 📚 Recursos Úteis

- [Documentação Koyeb](https://www.koyeb.com/docs)
- [Koyeb Status](https://status.koyeb.com)
- [Koyeb Community](https://community.koyeb.com)
- [Suporte Koyeb](https://www.koyeb.com/support)

---

## 🆘 Precisa de Ajuda?

Se tiver problemas:
1. Verifique os logs no dashboard
2. Consulte a seção de Troubleshooting acima
3. Abra um issue no GitHub do projeto
4. Entre em contato com o suporte do Koyeb

**Boa sorte com seu deploy! 🎊**
