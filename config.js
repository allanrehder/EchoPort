// Configuração de API
// Para desenvolvimento local, use: http://localhost:3000/api
// Para produção, atualize com a URL do seu backend no Render

const CONFIG = {
    // Altere esta URL após fazer deploy no Render
    API_BASE: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api'
        : 'https://echoport-api.onrender.com/api', // ATUALIZE COM SUA URL DO RENDER
};

export default CONFIG;
