# 🎵 EchoPort

**EchoPort** é uma aplicação web moderna para busca e descoberta de músicas eletrônicas, integrada com a API do Spotify.

## ✨ Funcionalidades

- 🔍 **Busca Inteligente por Artista** - Encontre faixas dos seus artistas favoritos
- 🎧 **Preview de Áudio** - Ouça trechos de 30 segundos direto no navegador
- 📊 **Análise Musical** - Link direto para Tunebat com informações de BPM, Key e mais
- 🎨 **Interface Moderna** - Design responsivo e intuitivo
- 🎼 **Curadoria VIP** - Seleção de artistas de Electronic Music ao carregar a página

## 🚀 Tecnologias

### Frontend

- HTML5
- CSS3 (com animações e gradientes modernos)
- JavaScript (Vanilla)
- Font Awesome (ícones)

### Backend

- Node.js
- Express.js
- Spotify Web API
- dotenv (gerenciamento de variáveis de ambiente)

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/allanrehder/EchoPort.git
cd EchoPort
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as credenciais do Spotify

Crie um arquivo `.env` na raiz do projeto:

```env
SPOTIFY_CLIENT_ID=seu_client_id_aqui
SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
```

**Como obter as credenciais:**

1. Acesse [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Faça login com sua conta Spotify
3. Clique em "Create App"
4. Copie o `Client ID` e `Client Secret`

### 4. Inicie o servidor

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

### 5. Abra o frontend

Abra o arquivo `index.html` em um navegador ou use um servidor local como Live Server (VS Code).

## 🎯 Como Usar

1. **Busca por Artista**: Digite o nome de um artista no campo de busca
2. **Ouça Previews**: Clique no ícone de play nas capas dos álbuns
3. **Análise Detalhada**: Clique em "Ver Análise Completa" para abrir o Tunebat
4. **Voltar ao Início**: Clique no botão "Início" para ver músicas curadas

## 📁 Estrutura do Projeto

```
EchoPort/
├── index.html              # Página principal
├── style.css               # Estilos da aplicação
├── script.js               # Lógica do frontend
├── server.js               # Servidor Express + API Spotify
├── fullTrackHandler.js     # Handler para busca completa de faixas
├── package.json            # Dependências do projeto
├── .env                    # Credenciais (NÃO COMMITAR!)
└── .gitignore              # Arquivos ignorados pelo Git
```

## 🔒 Segurança

⚠️ **IMPORTANTE**: Nunca compartilhe suas credenciais do Spotify!

- O arquivo `.env` está no `.gitignore` e não será enviado ao GitHub
- Use variáveis de ambiente em produção

## 🎨 Artistas em Destaque

A curadoria inclui mais de 50 artistas de Electronic Music, incluindo:

- Lost Frequencies, Avicii, Vintage Culture
- Martin Garrix, Tiesto, David Guetta
- Fred again.., Anyma, Boris Brejcha
- E muitos mais!

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Desenvolvido com ❤️ por [Allan Rehder](https://github.com/allanrehder)
