# 🎧 EchoPort: Análise Musical e Descoberta de Faixas

EchoPort é um projeto de descoberta musical e análise de faixas desenvolvido para fornecer aos usuários informações detalhadas sobre as características essenciais de qualquer música. Utilizando a robusta **Spotify Web API**, o EchoPort permite aos usuários pesquisar por faixas e artistas de música eletrônica, apresentando os resultados em cards interativos.

### ✨ Funcionalidades Principais

* **Busca por Faixas e Artistas:** Utilize a integração com a Spotify Web API para encontrar milhões de músicas.
* **Lista de Artistas VIP:** Pesquisa otimizada com uma lista de artistas importantes da cena eletrônica global.
* **Análise de Áudio (Redirect):** Cada card de resultado oferece um *redirecionamento inteligente* para o Tunebat, fornecendo acesso rápido a métricas avançadas essenciais para DJs e produtores:
    * **BPM** (Batidas por Minuto)
    * **Key** (Tonalidade, incluindo a notação Camelot Wheel)
    * **Energy** (Nível de energia da faixa)
    * **Danceability** (Nível de adequação para dançar)

### 💻 Tecnologias Utilizadas

O EchoPort foi construído sobre uma arquitetura moderna e escalável:

* **Backend:** Node.js (Para lidar com a autenticação e requisições da API).
* **API Principal:** Spotify Web API (Para busca e metadados de faixas).
* **Análise de Áudio:** Integração externa via *redirect* para o Tunebat.
* **Gerenciamento de Segredos:** `dotenv` (Para proteger as chaves `Client ID` e `Client Secret` do Spotify).

### 🚀 Como Rodar o Projeto Localmente

1.  **Clone o Repositório:**
    ```bash
    git clone [LINK DO SEU REPOSITÓRIO]
    cd EchoPort
    ```
2.  **Instale as Dependências:**
    ```bash
    npm install
    ```
3.  **Configuração de Chaves:**
    * Crie um arquivo `.env` na raiz do projeto.
    * Adicione suas credenciais do Spotify Developer Dashboard:
        ```env
        SPOTIFY_CLIENT_ID="SEU_ID"
        SPOTIFY_CLIENT_SECRET="SEU_SECRET"
        ```
4.  **Inicie o Servidor:**
    ```bash
    npm start # Ou o comando que você usa para iniciar o Node.js
    ```
