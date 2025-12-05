const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const fullTrackHandler = require('./fullTrackHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Função para obter token
async function getAccessToken() {
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

    if (!CLIENT_ID || !CLIENT_SECRET) throw new Error('Chaves não configuradas.');

    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    });
    
    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
}

// ROTA 1: BUSCA COMPLETA POR ID
app.get('/api/full-track', async (req, res) => {
    await fullTrackHandler(req, res);
});

// ROTA 2: BUSCA INTELIGENTE
app.get('/api/search-tracks', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Termo obrigatório." });

    try {
        const accessToken = await getAccessToken();
        let trackIds = [];

        // ESTRATÉGIA 1: Buscar por ARTISTA
        const artistSearchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=1&market=US`;
        const artistRes = await fetch(artistSearchUrl, { headers: { 'Authorization': `Bearer ${accessToken}` } });
        const artistData = await artistRes.json();

        if (artistData.artists && artistData.artists.items.length > 0) {
            const artist = artistData.artists.items[0];
            
            if (artist.name.toLowerCase().includes(query.toLowerCase()) || 
                query.toLowerCase().includes(artist.name.toLowerCase())) {
                
                console.log(`[✓] Artista: ${artist.name}`);
                
                const topTracksUrl = `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`;
                const topTracksRes = await fetch(topTracksUrl, { headers: { 'Authorization': `Bearer ${accessToken}` } });
                const topTracksData = await topTracksRes.json();
                
                if (topTracksData.tracks) {
                    trackIds = topTracksData.tracks.slice(0, 10).map(t => t.id);
                }
            }
        }

        // ESTRATÉGIA 2: Busca por FAIXA
        if (trackIds.length === 0) {
            console.log(`[→] Busca genérica: ${query}`);
            const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10&market=US`;
            const searchRes = await fetch(searchUrl, { headers: { 'Authorization': `Bearer ${accessToken}` } });
            const searchData = await searchRes.json();
            
            if (searchData.tracks) {
                trackIds = searchData.tracks.items.map(t => t.id);
            }
        }
        
        res.json({ trackIds });

    } catch (error) {
        console.error("Erro na busca:", error.message);
        res.status(500).json({ error: 'Falha ao buscar.' });
    }
});

// Lista de Artistas VIP (IDs corrigidos - apenas música eletrônica)
const VIP_ARTISTS = [
    "7f5Zgnp2spUuuzKplmRkt7", // Lost Frequencies
    "1vCWHaC5f2uS3yhpwWbIA6", // Avicii
    "60d24wfXkVzDSfLS6hyCjZ", // Martin Garrix
    "4D75GcNG95ebPtNvoNVXhz", // Afrojack
    "1Cs0zKBU1kc0i8ypK3B9ai", // David Guetta
    "28uJnu5EsrGml2tBd7y8ts", // Vintage Culture
    "0NGAZxHanS9e0iNHpR8f2W", // Alok
    "1HBjj22wzbscIZ9sEb5dyf", // Jonas Blue
    "23fqKkggKUBHNkbKtXEls4", // Kygo
    "4AVFqumd2ogHFlRbKIjp1t", // Alesso
    "1xNmvlEiICkRlRGqlNFZ43", // Axwell
    "6hyMWrxGBsOx6sWcVj1DqP", // Sebastian Ingrosso
    "1h6Cn3P4NGzXbaXidqURXs", // Swedish House Mafia
    "5sm0jQ1mq0dusiLtDJ2b4R", // Eric Prydz
    "5ChF3i92IPZHduM7jN3dpg", // Nicky Romero
    "37czgDRfGMvgRiUKHvnnhj", // Ownboss
    "61lyPtntblHJvA7FMMhi7E", // Duke Dumont
    "6nS5roXSAGhTGr34W6n7Et", // Disclosure
    "3wkaDi2HJV3eCaBJ4iH6om", // ANNA
    "29TpNOsTNYbLb6Xa10H0PR", // Miss Monique
    "0I6oCyQQ1Q50q97y9B9gAx", // Korolova
    "6htWLP8aiuf19FYMA4VQAZ", // Massano
    "58wlWYajhaIloGV3GlPd9M", // Disorder
    "2uGKgNuq7MnKksXiSO6HjB", // KVSH
    "4cdyqaBREB68H77QKCrKP1", // Dubdogz
    "2dhLVCzAEMbAu1SSkAoOGV", // JØRD
    "4oLeXFyACqeem2VImYeBFe", // Fred again.. 
    "1uRVM0wBdtyEuU582EeKJM", // NOTION
    "43BxCL6t4c73BQnIJtry5v", // James Hype
    "2CpLIMBoE2ZzyY3ZBCRZ7j", // BUNT.
    "5Igpc9iLZ3YGtKeYfSrrOE", // Chris Lake
    "1VJ0briNOlXRtJUAzoUJdt", // FISHER
    "4qLwtWhlhyAoQ4S9mSrDW9", // Odd Mob
    "5czbzNZZfWpyFgZyfT3Mkk", // SIDEPIECE
    "7kNqXtgeIwFtelmRjWv205", // John Summit
    "0DdDnziut7wOo6cAYWVZC5", // KREAM
    "4iBwchw0U0GZv5RfVYSMxN", // Anyma
    "3BkRu2TGd2I1uBxZKddfg1", // ARTBAT
    "6Jbyd4qzEtbFtswZP1o6Ht", // Agents Of Time
    "6QSwQEz8CDMg8Rqk8dEkxS", // Mathame
    "24DO0PijjITGIEWsO8XaPs", // Nora En Pure
    "0xRXCcSX89eobfrshSVdyu", // Meduza
    "6kT18gnkVrCz8xJQcrib7L", // Bhaskar
    "37UXlMGND0Tr7Su43RxHQ0", // Bruno Be
    "2jFK9ZXWDd7auJvfNfBcuC", // Future Class
    "2RuFDYlPPfFaYgj5dqz9lD", // Boris Brejcha
    "3sZvCZHU2V2idOYyUl3fBi", // Anamē 
    "14Tg9FvbNismPR1PJHxRau", // Sultan+Shepard
    "02DWGcShQivFepRvGJ7xhB", // Adriatique
    "1Zz6NBe8UIZjm88TvehFtx", // Le Youth
    "1WHFu22zN1C6F11Z1rt12K", // Jerro
    "7MmHXD2ESooP0XdgrVuKTK", // Marten Lou
    "08jywfUS0hp8XYlYs0cvz8", // Rampa
    "5mIowAJMp7RKNheelruV5z", // &ME
    "2loEsOijJ6XiGzWYFXMIRk", // Adam Port
    "26WKgv73kRHD0gEDKD1i8j", // Keinemusik
    "67hb7towEyKvt5Z8Bx306c", // Empire Of The Sun 
    "4sTQVOfp9vEMCemLw50sbu", // Galantis
    "1bj5GrcLom5gZFF5t949Xl", // Martin Solveig
];

// ROTA 3: FAIXAS CURADAS (HOME)
app.get('/api/curated-tracks', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const randomArtistId = VIP_ARTISTS[Math.floor(Math.random() * VIP_ARTISTS.length)];
        const topTracksUrl = `https://api.spotify.com/v1/artists/${randomArtistId}/top-tracks?market=US`;
        
        const response = await fetch(topTracksUrl, { headers: { 'Authorization': `Bearer ${accessToken}` } });
        const data = await response.json();

        if (!data.tracks) return res.status(404).json({ error: "Nenhuma faixa encontrada." });

        const trackIds = data.tracks.slice(0, 10).map(t => t.id);
        res.json({ trackIds });

    } catch (error) {
        console.error("Erro curadoria:", error.message);
        res.status(500).json({ error: 'Falha ao buscar curadoria.' });
    }
});

// ROTA 4: DISCOVER (Novos lançamentos ou Playlist Top)
app.get('/api/discover', async (req, res) => {
    try {
        const genre = req.query.genre;
        const query = genre ? `${genre}` : 'Top Electronic 2024';
        const accessToken = await getAccessToken();
        
        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=1&market=US`;
        const searchRes = await fetch(searchUrl, { headers: { 'Authorization': `Bearer ${accessToken}` } });
        const searchData = await searchRes.json();

        if (!searchData.playlists || searchData.playlists.items.length === 0) {
            return res.status(404).json({ error: "Nenhuma playlist encontrada." });
        }

        const playlistId = searchData.playlists.items[0].id;
        const playlistTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=20&market=US`;
        const tracksRes = await fetch(playlistTracksUrl, { headers: { 'Authorization': `Bearer ${accessToken}` } });
        const tracksData = await tracksRes.json();

        const trackIds = tracksData.items.map(item => item.track.id).filter(id => id);
        res.json({ trackIds });

    } catch (error) {
        console.error("Erro discover:", error.message);
        res.status(500).json({ error: 'Falha ao buscar discover.' });
    }
});

// ROTA 5: PLAYLISTS (Listar playlists de eletrônica)
app.get('/api/playlists', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const searchUrl = `https://api.spotify.com/v1/search?q=Electronic+Dance+Music&type=playlist&limit=12&market=US`;
        const searchRes = await fetch(searchUrl, { headers: { 'Authorization': `Bearer ${accessToken}` } });
        const searchData = await searchRes.json();

        if (!searchData.playlists) return res.status(404).json({ error: "Nenhuma playlist encontrada." });

        const playlists = searchData.playlists.items.map(p => ({
            id: p.id,
            name: p.name,
            image: p.images[0]?.url,
            description: p.description,
            owner: p.owner.display_name
        }));

        res.json({ playlists });

    } catch (error) {
        console.error("Erro playlists:", error.message);
        res.status(500).json({ error: 'Falha ao buscar playlists.' });
    }
});

// ROTA 6: ARTISTS (Listar DJs VIPs)
app.get('/api/artists', async (req, res) => {
    try {
        console.log("Rota /api/artists chamada");
        const accessToken = await getAccessToken();
        
        if (!VIP_ARTISTS || VIP_ARTISTS.length === 0) {
            console.error("VIP_ARTISTS está vazio!");
            return res.status(500).json({ error: "Configuração de artistas ausente." });
        }

        console.log(`Total de artistas VIP: ${VIP_ARTISTS.length}`);
        
        // A API do Spotify permite no máximo 50 artistas por requisição
        const BATCH_SIZE = 50;
        const allArtists = [];
        
        // Dividir em lotes de 50
        for (let i = 0; i < VIP_ARTISTS.length; i += BATCH_SIZE) {
            const batch = VIP_ARTISTS.slice(i, i + BATCH_SIZE);
            const selectedIds = batch.join(',');
            
            console.log(`Buscando lote ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} artistas`);
            
            const artistsUrl = `https://api.spotify.com/v1/artists?ids=${selectedIds}`;
            const response = await fetch(artistsUrl, { headers: { 'Authorization': `Bearer ${accessToken}` } });
            const data = await response.json();

            if (data.artists) {
                allArtists.push(...data.artists.filter(a => a !== null));
            } else {
                console.error("Spotify retornou erro no lote:", data);
            }
        }

        if (allArtists.length === 0) {
            console.error("Nenhum artista foi retornado pelo Spotify");
            return res.status(404).json({ error: "Nenhum artista encontrado (Spotify)." });
        }

        const artists = allArtists.map(a => ({
            id: a.id,
            name: a.name,
            image: a.images && a.images.length > 0 ? a.images[0].url : null,
            genres: a.genres && a.genres.length > 0 ? a.genres.slice(0, 2).join(', ') : 'Electronic',
            popularity: a.popularity
        }));

        console.log(`Retornando ${artists.length} artistas`);
        res.json({ artists });

    } catch (error) {
        console.error("Erro artists:", error.message);
        res.status(500).json({ error: 'Falha ao buscar artistas.' });
    }
});

app.listen(PORT, () => {
    console.log(`\n🎵 Servidor rodando em http://localhost:${PORT}\n`);
});