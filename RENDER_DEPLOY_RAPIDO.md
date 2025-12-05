# 🚀 Deploy Rápido no Render - 5 Minutos

Siga este guia passo a passo para fazer deploy do backend.

---

## 📍 PASSO 1: Login no Render (1 min)

1. ✅ Você já está em: https://render.com
2. Clique em **"Get Started for Free"** ou **"Sign In"**
3. Escolha **"Sign in with GitHub"** (mais rápido!)
4. Autorize o Render a acessar sua conta GitHub

---

## 📍 PASSO 2: Criar Web Service (2 min)

Após fazer login, você verá o **Dashboard do Render**.

1. Clique no botão **"New +"** (canto superior direito)
2. Selecione **"Web Service"**
3. Você verá uma lista de seus repositórios GitHub
4. **Procure por**: `EchoPort` ou `allanrehder/EchoPort`
5. Clique em **"Connect"** ao lado do repositório

---

## 📍 PASSO 3: Configurar o Serviço (1 min)

Preencha os campos conforme abaixo:

### Informações Básicas

- **Name**: `echoport-api` (ou qualquer nome que preferir)
- **Region**: `Oregon (US West)` (ou escolha o mais próximo)
- **Branch**: `main` ✅ (já deve estar selecionado)
- **Root Directory**: (deixe VAZIO)

### Build & Deploy

- **Runtime**: `Node` ✅ (deve detectar automaticamente)
- **Build Command**: `npm install` ✅
- **Start Command**: `npm start` ✅

### Instance Type

- **Instance Type**: `Free` ✅ (plano gratuito)

---

## 📍 PASSO 4: Adicionar Variáveis de Ambiente (1 min) ⚠️ IMPORTANTE

Role a página até encontrar a seção **"Environment Variables"**.

Clique em **"Add Environment Variable"** e adicione:

### Variável 1:

- **Key**: `SPOTIFY_CLIENT_ID`
- **Value**: `[COLE SEU CLIENT ID AQUI]`

### Variável 2:

- **Key**: `SPOTIFY_CLIENT_SECRET`
- **Value**: `[COLE SEU CLIENT SECRET AQUI]`

**📝 Onde encontrar suas credenciais?**

Abra o arquivo `.env` na raiz do projeto:

```
c:\Users\pc\Desktop\EchoPort_Alura\.env
```

Copie os valores de:

- `SPOTIFY_CLIENT_ID=...`
- `SPOTIFY_CLIENT_SECRET=...`

---

## 📍 PASSO 5: Criar e Aguardar Deploy (2-5 min)

1. **Revise** todas as configurações
2. Clique no botão azul **"Create Web Service"** (no final da página)
3. Você será redirecionado para a página de logs do deploy
4. **Aguarde** enquanto o Render:
   - Clona seu repositório
   - Instala as dependências (`npm install`)
   - Inicia o servidor (`npm start`)
5. Quando aparecer **"Live"** (bolinha verde), o deploy está completo! ✅

---

## 📍 PASSO 6: Copiar a URL do Backend

Quando o deploy estiver completo:

1. No topo da página, você verá a URL do seu backend
2. Será algo como: `https://echoport-api-xyz123.onrender.com`
3. **COPIE ESTA URL COMPLETA**

---

## 📍 PASSO 7: Testar o Backend

Abra uma nova aba e acesse:

```
https://SUA-URL-AQUI.onrender.com/api/curated-tracks
```

Substitua `SUA-URL-AQUI` pela URL que você copiou.

**✅ Deve retornar um JSON** com algo como:

```json
{
  "trackIds": ["abc123", "def456", ...]
}
```

Se retornar JSON, **parabéns! O backend está funcionando!** 🎉

---

## 📍 PASSO 8: Me Informe a URL

**Depois de copiar a URL do Render, cole aqui no chat.**

Exemplo: `https://echoport-api-xyz123.onrender.com`

Vou atualizar automaticamente o `script.js` para você! 🚀

---

## 🐛 Problemas Comuns

### "Build failed"

- Verifique se o `Build Command` está: `npm install`
- Verifique se o `Start Command` está: `npm start`

### "Application failed to respond"

- Verifique se adicionou as variáveis de ambiente corretamente
- Verifique se os valores do Spotify estão corretos (sem aspas extras)

### "Environment variable not found"

- Certifique-se de que adicionou AMBAS as variáveis:
  - `SPOTIFY_CLIENT_ID`
  - `SPOTIFY_CLIENT_SECRET`

---

## ⏰ Tempo Estimado

- Login: 1 min
- Configuração: 2 min
- Deploy: 2-5 min
- **TOTAL: ~5-8 minutos**

---

**🎯 Próximo Passo**: Após o deploy, me envie a URL e eu atualizo o frontend automaticamente!
