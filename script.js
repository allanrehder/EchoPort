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
        resultsGrid.innerHTML = '<div class="placeholder-message" style="color: #ff5555;"><p>Erro ao conectar com o servidor. Verifique se o backend está rodando (npm start).</p></div>';
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
// --- NAVEGAÇÃO ---
const navLinks = {
    home: document.getElementById('home-link'),
    discover: document.getElementById('discover-link'),
    playlists: document.getElementById('playlists-link'),
    artists: document.getElementById('artists-link')
};

function setActiveLink(activeId) {
    Object.values(navLinks).forEach(link => {
        if (link) link.classList.remove('active');
    });
    if (navLinks[activeId]) navLinks[activeId].classList.add('active');
}

// Event Listeners de Navegação
if (navLinks.home) {
    navLinks.home.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink('home');
        searchInput.value = '';
        loadCuratedTracks();
    });
}

if (navLinks.discover) {
    navLinks.discover.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink('discover');
        searchInput.value = '';
        loadDiscover();
    });
}

if (navLinks.playlists) {
    navLinks.playlists.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink('playlists');
        searchInput.value = '';
        loadPlaylists();
    });
}

if (navLinks.artists) {
    navLinks.artists.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink('artists');
        searchInput.value = '';
        loadArtists();
    });
}

// --- FUNÇÕES DE CARREGAMENTO ---

// 1. HOME (Curated Tracks)
async function loadCuratedTracks() {
    resultsGrid.innerHTML = '<div class="placeholder-message"><p>Carregando as melhores faixas de Electronic Music...</p></div>';
    document.querySelector('.section-title').innerText = 'Destaques da Home';
    
    try {
        const res = await fetch(`${API_BASE}/curated-tracks`);
        const data = await res.json();

        if (data.trackIds && data.trackIds.length > 0) {
            resultsGrid.innerHTML = '';
            const trackPromises = data.trackIds.map(id => 
                fetch(`${API_BASE}/full-track?id=${id}`).then(res => res.json()).catch(err => null)
            );
            const tracks = await Promise.all(trackPromises);
            const validTracks = tracks.filter(t => t !== null && !t.error);
            validTracks.forEach(createTrackCard);
        } else {
            resultsGrid.innerHTML = '<div class="placeholder-message"><p>Nenhuma faixa encontrada.</p></div>';
        }
    } catch (e) {
        console.error("Erro Home:", e);
        resultsGrid.innerHTML = '<div class="placeholder-message" style="color: #ff5555;"><p>Erro ao conectar com o servidor.</p></div>';
    }
}

// 2. DISCOVER (Gêneros do Beatport)
const BEATPORT_GENRES = [
    { name: "House", query: "House Music Top 100" },
    { name: "Melodic House & Techno", query: "Melodic House & Techno Top 100" },
    { name: "Mainstage", query: "Mainstage Festival Big Room" },
    { name: "Progressive House", query: "Progressive House Top 100" },
    { name: "Afro House", query: "Afro House Top 100" },
    { name: "Tech House", query: "Tech House Top 100" },
    { name: "Organic House", query: "Organic House Downtempo" },
    { name: "Funky House", query: "Funky House Classics" },
    { name: "Electronica", query: "Electronica Top 100" },
    { name: "Bass House", query: "Bass House Top 100" }
];

async function loadDiscover() {
    resultsGrid.innerHTML = '';
    document.querySelector('.section-title').innerText = 'Discover: Gêneros Populares';
    
    BEATPORT_GENRES.forEach(genre => createGenreCard(genre));
}

function createGenreCard(genre) {
    const card = document.createElement('div');
    card.className = 'track-card';
    
    // Usando um gradiente ou imagem genérica para gêneros
    card.innerHTML = `
        <div class="image-container" style="background: linear-gradient(45deg, #1db954, #191414); display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-compact-disc" style="font-size: 4rem; color: white; opacity: 0.8;"></i>
            <div class="play-overlay">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div class="track-info">
            <h3 title="${genre.name}">${genre.name}</h3>
            <p style="font-size: 0.8rem; color: #999;">Explorar Top 100</p>
        </div>
    `;

    card.addEventListener('click', () => loadGenreTracks(genre));
    resultsGrid.appendChild(card);
}

async function loadGenreTracks(genre) {
    resultsGrid.innerHTML = `<div class="placeholder-message"><p>Buscando as melhores de ${genre.name}...</p></div>`;
    document.querySelector('.section-title').innerText = `Discover: ${genre.name}`;

    try {
        const res = await fetch(`${API_BASE}/discover?genre=${encodeURIComponent(genre.query)}`);
        const data = await res.json();

        if (data.trackIds && data.trackIds.length > 0) {
            resultsGrid.innerHTML = '';
            
            // Adiciona botão de voltar
            const backBtn = document.createElement('button');
            backBtn.innerText = '← Voltar para Gêneros';
            backBtn.className = 'home-btn'; // Reutiliza estilo
            backBtn.style.marginBottom = '20px';
            backBtn.onclick = loadDiscover;
            resultsGrid.parentNode.insertBefore(backBtn, resultsGrid);
            
            // Limpa o botão de voltar anterior se houver (gambiarra rápida, ideal seria gerenciar melhor o estado)
            const oldBtns = document.querySelectorAll('.home-btn');
            if(oldBtns.length > 1) oldBtns[0].remove();

            const trackPromises = data.trackIds.map(id => 
                fetch(`${API_BASE}/full-track?id=${id}`).then(res => res.json()).catch(err => null)
            );
            const tracks = await Promise.all(trackPromises);
            const validTracks = tracks.filter(t => t !== null && !t.error);
            validTracks.forEach(createTrackCard);
            
        } else {
            resultsGrid.innerHTML = '<div class="placeholder-message"><p>Nada encontrado para este gênero.</p></div>';
        }
    } catch (e) {
        console.error("Erro Genre:", e);
        resultsGrid.innerHTML = '<div class="placeholder-message" style="color: #ff5555;"><p>Erro ao carregar gênero.</p></div>';
    }
}

// 3. PLAYLISTS
async function loadPlaylists() {
    resultsGrid.innerHTML = '<div class="placeholder-message"><p>Buscando playlists...</p></div>';
    document.querySelector('.section-title').innerText = 'Playlists em Alta';

    try {
        const res = await fetch(`${API_BASE}/playlists`);
        const data = await res.json();

        if (data.playlists && data.playlists.length > 0) {
            resultsGrid.innerHTML = '';
            data.playlists.forEach(createPlaylistCard);
        } else {
            resultsGrid.innerHTML = '<div class="placeholder-message"><p>Nenhuma playlist encontrada.</p></div>';
        }
    } catch (e) {
        console.error("Erro Playlists:", e);
        resultsGrid.innerHTML = '<div class="placeholder-message" style="color: #ff5555;"><p>Erro ao carregar Playlists.</p></div>';
    }
}

// 4. ARTISTS
async function loadArtists() {
    resultsGrid.innerHTML = '<div class="placeholder-message"><p>Carregando artistas...</p></div>';
    document.querySelector('.section-title').innerText = 'Artistas em Destaque';

    try {
        const res = await fetch(`${API_BASE}/artists`);
        const data = await res.json();

        if (data.artists && data.artists.length > 0) {
            resultsGrid.innerHTML = '';
            data.artists.forEach(createArtistCard);
        } else {
            resultsGrid.innerHTML = '<div class="placeholder-message"><p>Nenhum artista encontrado.</p></div>';
        }
    } catch (e) {
        console.error("Erro Artists:", e);
        resultsGrid.innerHTML = '<div class="placeholder-message" style="color: #ff5555;"><p>Erro ao carregar Artistas.</p></div>';
    }
}

// --- CARDS ESPECÍFICOS ---

function createPlaylistCard(playlist) {
    const card = document.createElement('div');
    card.className = 'track-card'; // Reutilizando estilo de card
    const image = playlist.image || 'https://via.placeholder.com/300x300?text=No+Image';

    card.innerHTML = `
        <div class="image-container">
            <img src="${image}" alt="${playlist.name}">
            <div class="play-overlay">
                <i class="fas fa-list"></i>
            </div>
        </div>
        <div class="track-info">
            <h3 title="${playlist.name}">${playlist.name}</h3>
            <p style="font-size: 0.8rem; color: #999;">Por ${playlist.owner}</p>
        </div>
    `;
    // Ao clicar, poderia abrir a playlist no Spotify ou carregar as músicas dela
    card.addEventListener('click', () => {
        window.open(`https://open.spotify.com/playlist/${playlist.id}`, '_blank');
    });
    resultsGrid.appendChild(card);
}

function createArtistCard(artist) {
    const card = document.createElement('div');
    card.className = 'track-card';
    const image = artist.image || 'https://via.placeholder.com/300x300?text=No+Image';

    card.innerHTML = `
        <div class="image-container" style="border-radius: 50%;">
            <img src="${image}" alt="${artist.name}" style="border-radius: 50%;">
        </div>
        <div class="track-info" style="text-align: center; margin-top: 10px;">
            <h3 title="${artist.name}" style="font-size: 1.1rem;">${artist.name}</h3>
            <p style="font-size: 0.8rem; color: #999;">${artist.genres || 'Electronic'}</p>
        </div>
    `;
    
    card.addEventListener('click', () => {
        // Ao clicar no artista, faz uma busca pelas músicas dele no app
        searchInput.value = artist.name;
        searchTracks();
    });
    resultsGrid.appendChild(card);
}

// Inicialização: Carregar músicas curadas (Home)
window.addEventListener('DOMContentLoaded', loadCuratedTracks);
