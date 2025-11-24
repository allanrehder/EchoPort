const fetch = require("node-fetch");

// FUNÇÃO AUXILIAR: Conversão de Key Camelot
const toCamelot = (key, mode) => {
    const camelotMap = {
        0: { major: '8B', minor: '5A' }, 1: { major: '3B', minor: '12A' },
        2: { major: '10B', minor: '7A' }, 3: { major: '5B', minor: '2A' },
        4: { major: '12B', minor: '9A' }, 5: { major: '7B', minor: '4A' },
        6: { major: '2B', minor: '11A' }, 7: { major: '9B', minor: '6A' },
        8: { major: '4B', minor: '1A' }, 9: { major: '11B', minor: '8A' },
        10: { major: '6B', minor: '3A' }, 11: { major: '1B', minor: '10A' }
    };
    const keyType = mode === 1 ? 'major' : 'minor';
    return camelotMap[key]?.[keyType] || 'N/A';
};

module.exports = async function handler(req, res) {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "ID da faixa é obrigatório" });

    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
        return res.status(500).json({ error: 'Chaves de ambiente não configuradas.' });
    }

    try {
        // 1) TOKEN SPOTIFY
        const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: "Basic " + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            console.error("[✗] Erro Token:", tokenData);
            return res.status(500).json({ error: 'Falha na autenticação.' });
        }

        // 2) BUSCAR METADADOS DA FAIXA
        const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${id}?market=US`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const track = await trackRes.json();
        
        if (track.error) {
            console.error("[✗] Erro Track:", track.error);
            return res.status(track.error.status).json({ error: track.error.message });
        }

        // 3) BUSCAR AUDIO FEATURES COM VALIDAÇÃO ROBUSTA
        let features = null;
        try {
            const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const featuresData = await featuresRes.json();

            // VALIDAÇÃO CRÍTICA: Verifica se retornou dados válidos
            if (!featuresData || featuresData.error || !featuresData.tempo) {
                console.warn(`[⚠] Audio Features não encontradas ou incompletas para: ${track.name || id}`);
                
                // Retorna objeto SEGURO com valores padronizados
                features = {
                    tempo: null,
                    key: -1,
                    mode: -1,
                    energy: 0.0,
                    danceability: 0.0,
                };
            } else {
                // Dados válidos recebidos
                features = featuresData;
                console.log(`[✓] Audio Features obtidas para: ${track.name}`);
            }
        } catch (featErr) {
            console.error(`[✗] Erro ao buscar Audio Features:`, featErr.message);
            
            // Em caso de erro de rede/timeout, retorna objeto seguro
            features = {
                tempo: null,
                key: -1,
                mode: -1,
                energy: 0.0,
                danceability: 0.0,
            };
        }

        // 4) BUSCAR GÊNERO DO ARTISTA
        let genres = ["Electronic"];
        if (track.artists && track.artists.length > 0) {
            try {
                const artistRes = await fetch(`https://api.spotify.com/v1/artists/${track.artists[0].id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                const artistData = await artistRes.json();
                
                if (artistData.genres && artistData.genres.length > 0) {
                    genres = artistData.genres.slice(0, 3);
                }
            } catch (err) {
                console.error("[✗] Erro ao buscar gênero:", err.message);
            }
        }

        // 5) FALLBACK DEEZER (Preview e BPM)
        let finalPreviewUrl = track.preview_url;
        let deezerBpm = null;

        try {
            const queryDeezer = `${track.artists[0].name} ${track.name}`;
            const deezerRes = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(queryDeezer)}&limit=1`);
            const deezerData = await deezerRes.json();

            if (deezerData.data && deezerData.data.length > 0) {
                const deezerTrack = deezerData.data[0];
                
                // Fallback de Preview
                if (!finalPreviewUrl) {
                    finalPreviewUrl = deezerTrack.preview;
                    console.log(`[✓] Preview da Deezer para: ${track.name}`);
                }

                // Fallback de BPM (só se Spotify não tiver)
                if (!features.tempo) {
                    const deezerDetailsRes = await fetch(`https://api.deezer.com/track/${deezerTrack.id}`);
                    const deezerDetails = await deezerDetailsRes.json();
                    if (deezerDetails.bpm && deezerDetails.bpm > 0) {
                        deezerBpm = deezerDetails.bpm;
                        console.log(`[✓] BPM da Deezer: ${deezerBpm}`);
                    }
                }
            }
        } catch (deezerError) {
            console.error("[✗] Erro Deezer:", deezerError.message);
        }

        // 6) CONSOLIDAR DADOS
        let finalBpm = 'N/A';
        if (features.tempo) {
            finalBpm = Math.round(features.tempo);
        } else if (deezerBpm) {
            finalBpm = Math.round(deezerBpm);
        }

        const camelotKey = (features.key !== -1 && features.mode !== -1)
            ? toCamelot(features.key, features.mode)
            : 'N/A';

        const energyVal = typeof features.energy === 'number' ? Math.round(features.energy * 100) : 0;
        const danceVal = typeof features.danceability === 'number' ? Math.round(features.danceability * 100) : 0;

        const result = {
            id: track.id,
            title: track.name,
            artist: track.artists.map(a => a.name).join(", "),
            album: track.album.name,
            cover: track.album.images?.[0]?.url ?? null,
            preview: finalPreviewUrl,
            genres: genres,
            features: {
                bpm: finalBpm,
                key_numeric: features.key !== -1 ? features.key : 'N/A',
                camelot: camelotKey,
                energy: energyVal,
                danceability: danceVal,
            }
        };

        return res.status(200).json(result);

    } catch (e) {
        console.error("[✗] ERRO CRÍTICO:", e.message);
        return res.status(500).json({ error: "Falha ao processar faixa." });
    }
}