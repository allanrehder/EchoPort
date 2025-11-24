const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const fullTrackHandler = require('./fullTrackHandler');

dotenv.config();

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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

// Lista de Artistas VIP
const VIP_ARTISTS = [
    "7f5Zgnp2spUuuzKplmRkt7", // Lost Frequencies
    "1vCWHaC5obZyTwC1KtKuS0", // Avicii
    "28gNT5JBFheIaDjlTxRlGw", // Vintage Culture
    "5H8F6jYd5I5y3f6g8e5j5w", // James Hype
    "1vyhD5VmyZ7KMfW5gqLgo5", // Alok
    "1mYsTxnqsHf2AtchbsFqGE", // Jonas Blue
    "2o5jDhtHVPhrJdv3cEQ99Z", // Tiesto
    "60d24wfXkVzDSfLS6hyCjZ", // Martin Garrix
    "64KEffDW9EtZ1y2vGTVADx", // Marshmello
    "23fqKkggKUBHNkbKtXEls4", // Kygo
    "00HzEL0vK4QzVjVwL090kI", // Calvin Harris
    "69GGBxA162lTqCwzJG5jLp", // The Chainsmokers
    "8AfSCLyXnE9Hw9A8LpXg2e", // David Guetta
    "83IP8IVgA7Qj8tp8I41Cgt", // Dimitri Vegas & Like Mike
    "5dS3l7WcDlR8H6Aunf3eUN", // Nicky Romero
    "68QoX5l02W0k2B8f59S6rX", // Artbat
    "3g8vL37i3YQf0S_I6q6gY4", // anamē
    "251F94Hh5W8CRJkH6CYAHm", // Boris Brejcha
    "58yEfbchgMDy8o35YhP4rj", // Jerro
    "2GgO8771hJ7q57v3E0gBfa", // Jan Blomqvist
    "6b6JvA16Ym1FmSOtN2eYV9", // Anyma
    "10iNfWUDF6eBHjQzO0Kq0l", // Empire Of The Sun 
    "4C2k0W3FzmkWStSqDFLDy0", // Lane 8
    "mj0VDI3z9r9iY6A3JBHw8X", // Tinlicker
    "6G92VwLzF7F8H8gW4sH12o", // Keinemusik
    "3h7_hH3e1vFkKq8JTSwE0J", // Rampa
    "2_T3qU1l1J6f25uKj6s1hT", // Adam Port
    "2jQ45jRj38Ww3n2J6g2Y5h", // &ME
    "70lF5p1Xq2u8D4xHqI3uHq", // Miss Monique
    "4a2Vf3hP1CgR9Dq9yvJ3t4", // Korolova
    "2k0xmLj5KjUAnHlBGJsoUY", // KREAM
    "5cM4D8wJg0FkXm4LhBqUzm", // Sultan + Shepard
    "2o9wxRseDkU94ChZtT35hk"  // Afrojack
    "4Z4S7YQvC6QvJqYwXj6U2k", // Agents Of Time
    "4GgD5UeI4X9b7V6Vf2hV2J", // Adriatique
    "23FZEm4AcG3AwG5vL2c4lF", // Fred again..
    "7gbU1bk27MjYVrgpetzARu", // Chris Lake
    "2IF0LSLkGz2tT9SpzFhQY7", // Oliver Heldens
    "5fWl4uS0YVccWk6C7vgffG", // Nora En Pure
    "4tUZE38F7GmYxSnnBPM71K", // Meduza
    "3D4Jfd5KKOjA6KkHh8PBYg", // Ownboss
    "4cdyqaBREB68H77QKCrKP1", // Dubdogz
    "7t3uHlqH0pnbLtv1rnsqrA", // Cat Dealers
    "6j8BqG5L5Hl1JgC6S6Mh5n", // Bruno Martini
    "0qM6SOGgW8PaeBnhp6Vz43", // Bhaskar
    "2Qe6z6VAzFErFhNwtF9xS5", // KVSH
    "40O66C1DUMYk0pZ96FA7nm", // NUZB
    "12sJb8W5cTjLz3l3E2sT7A", // Carola
    "1dG605neGtyfR3H3FnhI5Q", // Kohen
    "7dUEw0n6T99vN3S58MTn5J"  // Chemical Surf
    "3XFvR5N17GjVzC8qEaP1Tj", // ANNA
    "5DqU86E0S3J7cQd18aW3bB", // JORD
    "5yV9jH0S1ygo90ZJzzB6tS", // Fancy Inc
    "2T3f05u1gHhE2yYfRk74yS", // Future Class
    "0sLVD8XPSyCjFfFMHhELpF"  // Zerb
    "7KkC7wXw2kS085g7p5Bq1w", // Antdot
    "6j1mGjH4z0y1kGkGg6f5uO"  // Riascode

];

// ROTA 3: FAIXAS CURADAS
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

app.listen(PORT, () => {
    console.log(`\n🎵 Servidor rodando em http://localhost:${PORT}\n`);
});