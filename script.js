const API_BASE = 'http://localhost:3000/api';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsGrid = document.getElementById('results-grid');

// Estado de áudio global
let currentAudio = null;
let currentButton = null;

// Função principal de busca
async function searchTracks() {
    const query = searchInput.value.trim();

    if (!query) return alert('Por favor, digite o nome de um artista para buscar.');

    resultsGrid.innerHTML = '<div class="placeholder-message"><p>Buscando faixas...</p></div>';

    try {
        const searchRes = await fetch(`${API_BASE}/search-tracks?q=${encodeURIComponent(query)}`);
        const searchData = await searchRes.json();

        if (!searchData.trackIds || searchData.trackIds.length === 0) {
            resultsGrid.innerHTML = '<div class="placeholder-message"><p>Nenhuma faixa encontrada.</p></div>';
            return;
        }

        resultsGrid.innerHTML = '';

        const trackPromises = searchData.trackIds.map(id => 
            fetch(`${API_BASE}/full-track?id=${id}`)
                .then(res => res.json())
                .catch(err => null)
        );

        let tracks = await Promise.all(trackPromises);
        tracks = tracks.filter(t => t !== null && !t.error);

        if (tracks.length === 0) {
            resultsGrid.innerHTML = '<div class="placeholder-message"><p>Nenhuma faixa encontrada.</p></div>';
            return;
        }

        tracks.forEach(createTrackCard);

    } catch (error) {
        console.error('Erro na busca:', error);
        resultsGrid.innerHTML = '<div class="placeholder-message" style="color: #ff5555;"><p>Erro ao conectar com o servidor.</p></div>';
    }
}

// Cria o elemento HTML do card
function createTrackCard(track) {
    const card = document.createElement('div');
    card.className = 'track-card';

    const coverUrl = track.cover || 'https://via.placeholder.com/300x300?text=No+Cover';

    card.innerHTML = `
        <div class="image-container">
            <img src="${coverUrl}" alt="${track.title}">
            <div class="play-overlay" onclick="togglePreview('${track.preview || ''}', this)">
                <i class="fas fa-play"></i>
            </div>
        </div>
        
        <div class="track-info">
            <h3 title="${track.title}">${track.title}</h3>
            <p title="${track.artist}">${track.artist}</p>
            <p style="font-size: 0.8rem; color: #666; margin-top: 4px;">${track.album}</p>
            
            <!-- Link para Tunebat -->
            <a href="https://tunebat.com/Search?q=${encodeURIComponent(track.artist + ' ' + track.title)}" 
               target="_blank" 
               style="display: inline-block; margin-top: 10px; padding: 8px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 20px; font-size: 0.75rem; font-weight: bold; transition: transform 0.2s;"
               onmouseover="this.style.transform='scale(1.05)'" 
               onmouseout="this.style.transform='scale(1)'">
                <i class="fas fa-chart-line"></i> Ver Análise Completa
            </a>
        </div>
    `;

    resultsGrid.appendChild(card);
}

// Função para tocar/pausar preview
window.togglePreview = (url, btn) => {
    if (!url || url === 'null' || url === 'undefined') {
        alert('Preview de áudio não disponível para esta faixa.');
        return;
    }

    const icon = btn.querySelector('i');

    if (currentAudio && currentAudio.src === url) {
        if (currentAudio.paused) {
            currentAudio.play();
            icon.className = 'fas fa-pause';
        } else {
            currentAudio.pause();
            icon.className = 'fas fa-play';
        }
        return;
    }

    if (currentAudio) {
        currentAudio.pause();
        if (currentButton) {
            currentButton.querySelector('i').className = 'fas fa-play';
        }
    }

    currentAudio = new Audio(url);
    currentButton = btn;
    
    currentAudio.play();
    icon.className = 'fas fa-pause';

    currentAudio.onended = () => {
        icon.className = 'fas fa-play';
        currentAudio = null;
    };
};

// Event Listeners
searchButton.addEventListener('click', searchTracks);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchTracks();
});

// Botão de Início - Recarrega músicas curadas
const homeButton = document.getElementById('home-button');
homeButton.addEventListener('click', () => {
    searchInput.value = ''; // Limpa a busca
    loadCuratedTracks(); // Recarrega músicas curadas
});

// Função para carregar músicas curadas
async function loadCuratedTracks() {
    resultsGrid.innerHTML = '<div class="placeholder-message"><p>Carregando as melhores faixas de Electronic Music...</p></div>';
    
    try {
        const res = await fetch(`${API_BASE}/curated-tracks`);
        const data = await res.json();

        if (data.trackIds && data.trackIds.length > 0) {
            resultsGrid.innerHTML = '';
            
            const trackPromises = data.trackIds.map(id => 
                fetch(`${API_BASE}/full-track?id=${id}`)
                    .then(res => res.json())
                    .catch(err => null)
            );

            const tracks = await Promise.all(trackPromises);
            const validTracks = tracks.filter(t => t !== null && !t.error);
            
            validTracks.forEach(createTrackCard);
        } else {
            resultsGrid.innerHTML = '<div class="placeholder-message"><p>Use a barra de busca para encontrar artistas.</p></div>';
        }
    } catch (e) {
        console.error("Erro ao carregar curadoria:", e);
        resultsGrid.innerHTML = '<div class="placeholder-message"><p>Use a barra de busca para encontrar artistas.</p></div>';
    }
}

// Inicialização: Carregar músicas curadas
window.addEventListener('DOMContentLoaded', loadCuratedTracks);
