# 🚀 Guia de Deploy - EchoPort

Este guia mostra como fazer deploy do **EchoPort** com backend no **Render** e frontend no **GitHub Pages**.

---

## 📋 Pré-requisitos

- Conta no [GitHub](https://github.com)
- Conta no [Render](https://render.com) (gratuita)
- Credenciais do Spotify (Client ID e Client Secret)

---

## 🔧 Parte 1: Deploy do Backend no Render

### 1.1 Preparar o Repositório

Certifique-se de que todos os arquivos estão commitados:

```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### 1.2 Criar Web Service no Render

1. Acesse [https://dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub **allanrehder/EchoPort**
4. Configure:
   - **Name**: `echoport-api` (ou outro nome de sua preferência)
   - **Region**: `Oregon (US West)` (ou mais próximo)
   - **Branch**: `main`
   - **Root Directory**: deixe vazio
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 1.3 Adicionar Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

```
SPOTIFY_CLIENT_ID = seu_client_id_aqui
SPOTIFY_CLIENT_SECRET = seu_client_secret_aqui
```

### 1.4 Fazer Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (pode levar 2-5 minutos)
3. Copie a URL gerada (exemplo: `https://echoport-api.onrender.com`)

---

## 🌐 Parte 2: Atualizar Frontend com URL do Backend

### 2.1 Atualizar script.js

Abra o arquivo `script.js` e localize a linha 4:

```javascript
: 'https://echoport-api.onrender.com/api'; // ATUALIZE COM SUA URL DO RENDER APÓS DEPLOY
```

**Substitua** `https://echoport-api.onrender.com/api` pela URL real do seu backend + `/api`

Exemplo:

```javascript
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "https://SEU-NOME-AQUI.onrender.com/api";
```

### 2.2 Commitar Mudanças

```bash
git add script.js
git commit -m "Atualizar URL do backend para produção"
git push origin main
```

---

## 📄 Parte 3: Configurar GitHub Pages

### 3.1 Ativar GitHub Pages

1. Acesse seu repositório no GitHub
2. Vá em **Settings** → **Pages**
3. Em **Source**, selecione:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Clique em **Save**

### 3.2 Aguardar Deploy

- O GitHub Pages levará 1-2 minutos para fazer deploy
- A URL será: `https://allanrehder.github.io/EchoPort/`

---

## ✅ Parte 4: Testar a Aplicação

1. Acesse `https://allanrehder.github.io/EchoPort/`
2. Teste a busca por artistas
3. Verifique se os previews de áudio funcionam
4. Navegue pelas abas (Home, Discover, Playlists, Artists)

---

## 🐛 Solução de Problemas

### Erro: "Erro ao conectar com o servidor"

**Causa**: Backend não está respondendo ou URL incorreta

**Solução**:

1. Verifique se o backend está online no Render
2. Confirme que a URL em `script.js` está correta
3. Abra o Console do navegador (F12) para ver erros detalhados

### Erro: "CORS Policy"

**Causa**: CORS não configurado corretamente

**Solução**: Já está configurado no `server.js`. Se persistir, verifique se fez push das mudanças.

### Backend no Render está "dormindo"

**Causa**: Plano gratuito do Render coloca serviços inativos para dormir após 15 minutos

**Solução**:

- A primeira requisição pode levar 30-60 segundos
- Considere usar um serviço de "ping" como [UptimeRobot](https://uptimerobot.com) para manter ativo

---

## 🔄 Atualizações Futuras

Para atualizar o projeto:

```bash
# Fazer mudanças no código
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

- **Backend**: Render fará redeploy automaticamente
- **Frontend**: GitHub Pages atualizará em 1-2 minutos

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Render Dashboard
2. Abra o Console do navegador (F12) para ver erros
3. Revise este guia passo a passo

---

**Desenvolvido com ❤️ por Allan Rehder**
