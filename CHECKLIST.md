# ✅ Checklist de Deploy - EchoPort

Use este checklist para garantir que tudo está configurado corretamente.

---

## 📋 Pré-Deploy

- [x] Código commitado e enviado ao GitHub
- [x] Arquivo `render.yaml` criado
- [x] `server.js` configurado com PORT dinâmico
- [x] `script.js` configurado para alternar entre local/produção
- [x] `.gitignore` protegendo `.env`
- [x] Guia de deploy (`DEPLOY.md`) criado

---

## 🔧 Deploy do Backend (Render)

### Passo 1: Criar conta no Render

- [ ] Acessar [https://render.com](https://render.com)
- [ ] Criar conta (pode usar GitHub para login rápido)

### Passo 2: Criar Web Service

- [ ] Clicar em "New +" → "Web Service"
- [ ] Conectar repositório GitHub: `allanrehder/EchoPort`
- [ ] Configurar:
  - Name: `echoport-api` (ou outro nome)
  - Region: `Oregon (US West)` ou mais próximo
  - Branch: `main`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Instance Type: `Free`

### Passo 3: Adicionar Variáveis de Ambiente

- [ ] Adicionar `SPOTIFY_CLIENT_ID` = `seu_client_id`
- [ ] Adicionar `SPOTIFY_CLIENT_SECRET` = `seu_client_secret`

### Passo 4: Deploy

- [ ] Clicar em "Create Web Service"
- [ ] Aguardar deploy (2-5 minutos)
- [ ] Copiar URL gerada (ex: `https://echoport-api.onrender.com`)

### Passo 5: Testar Backend

- [ ] Acessar `https://SUA-URL.onrender.com/api/curated-tracks`
- [ ] Verificar se retorna JSON com `trackIds`

---

## 🌐 Atualizar Frontend com URL do Backend

### Passo 6: Atualizar script.js

- [ ] Abrir `script.js`
- [ ] Localizar linha 4: `'https://echoport-api.onrender.com/api'`
- [ ] Substituir pela URL real do seu backend
- [ ] Exemplo: `'https://echoport-api-abc123.onrender.com/api'`

### Passo 7: Commitar Mudança

```bash
git add script.js
git commit -m "Atualizar URL do backend para produção"
git push origin main
```

- [ ] Executar comandos acima

---

## 📄 Configurar GitHub Pages

### Passo 8: Ativar GitHub Pages

- [ ] Acessar [https://github.com/allanrehder/EchoPort](https://github.com/allanrehder/EchoPort)
- [ ] Ir em **Settings** → **Pages**
- [ ] Em **Source**, selecionar:
  - Branch: `main`
  - Folder: `/ (root)`
- [ ] Clicar em **Save**

### Passo 9: Aguardar Deploy

- [ ] Aguardar 1-2 minutos
- [ ] Verificar mensagem de sucesso no topo da página

---

## ✅ Testar Aplicação em Produção

### Passo 10: Acessar e Testar

- [ ] Acessar `https://allanrehder.github.io/EchoPort/`
- [ ] Testar busca por artista (ex: "Martin Garrix")
- [ ] Verificar se resultados aparecem
- [ ] Testar preview de áudio
- [ ] Navegar pelas abas: Home, Discover, Playlists, Artists
- [ ] Verificar se imagens carregam corretamente

---

## 🐛 Solução de Problemas

### Se aparecer "Erro ao conectar com o servidor":

1. **Verificar Console do Navegador** (F12):

   - [ ] Abrir DevTools → Console
   - [ ] Procurar por erros de CORS ou 404
   - [ ] Anotar mensagem de erro

2. **Verificar URL do Backend**:

   - [ ] Confirmar que URL em `script.js` está correta
   - [ ] Testar URL diretamente no navegador: `https://SUA-URL.onrender.com/api/curated-tracks`

3. **Verificar Status do Render**:

   - [ ] Acessar [Render Dashboard](https://dashboard.render.com)
   - [ ] Verificar se serviço está "Live" (verde)
   - [ ] Checar logs para erros

4. **Backend "dormindo" (plano gratuito)**:
   - [ ] Aguardar 30-60 segundos na primeira requisição
   - [ ] Recarregar página

---

## 🎉 Deploy Concluído!

Se todos os itens acima estão marcados, parabéns! Seu **EchoPort** está no ar! 🚀

**URLs Finais:**

- 🌐 Frontend: `https://allanrehder.github.io/EchoPort/`
- 🔧 Backend: `https://SUA-URL.onrender.com`

---

## 📝 Atualizações Futuras

Para fazer atualizações:

```bash
# Fazer mudanças no código
git add .
git commit -m "Descrição da mudança"
git push origin main
```

- Backend (Render): Redeploy automático em 2-5 min
- Frontend (GitHub Pages): Atualização em 1-2 min

---

**Desenvolvido com ❤️ por Allan Rehder**
