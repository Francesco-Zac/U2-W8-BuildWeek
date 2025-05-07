const API_URL = "https://deezerdevs-deezer.p.rapidapi.com/search";
const API_HEADERS = {
  "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  "x-rapidapi-key": "cc86585e1bmsh8224b8bcd2125cbp1d59afjsnf1a7d7b59fbe",
};

// Dati statici per Sfera Ebbasta (in caso l'API non funzioni)
const SFERA_EBBASTA_DATA = {
  name: "Sfera Ebbasta",
  picture: "https://e-cdns-images.dzcdn.net/images/artist/0140defb5b1a3fba8dc78019ed08a3c0/1000x1000-000000-80-0-0.jpg",
  listeners: "7.095.401",
  tracks: [
    { title: "NEON", plays: "17.797.520", duration: "3:46", explicit: true },
    { title: "NON METTERCI BECCO", plays: "12.379.863", duration: "3:02", explicit: true },
    { title: "SEI PERSA", plays: "8.374.373", duration: "2:58", explicit: true },
    { title: "MOLECOLE SPRITE", plays: "7.805.670", duration: "2:54", explicit: true },
    { title: "SNTMNG", plays: "7.509.373", duration: "3:12", explicit: true },
  ],
  playlists: [{ title: "SANTANA MONEY GANG", description: "Playlist", image: "https://i.scdn.co/image/ab67706c0000da84a0147c2e2128952a285a9efa" }],
};

window.addEventListener("DOMContentLoaded", initArtistPage);

async function initArtistPage() {
  const params = new URLSearchParams(window.location.search);
  const artistQuery = params.get("artist")?.trim() || "Sfera Ebbasta";

  try {
    // 1) Cerco l'artista
    const url = `${API_URL}?q=artist:"${encodeURIComponent(artistQuery)}"&limit=5`;
    const res = await fetch(url, { method: "GET", headers: API_HEADERS });

    if (!res.ok) {
      // Se l'API non funziona, uso i dati statici di Sfera Ebbasta
      renderArtistData(SFERA_EBBASTA_DATA);
      return;
    }

    const json = await res.json();
    const data = json.data || [];

    if (data.length === 0) {
      // Se non ci sono risultati, uso i dati statici
      renderArtistData(SFERA_EBBASTA_DATA);
      return;
    }

    // 2) Estraggo l'oggetto artist dal primo risultato
    const firstTrack = data[0];
    const artist = firstTrack.artist;

    // 3) Preparo i dati dell'artista
    const artistData = {
      name: artist.name,
      picture: artist.picture_xl || artist.picture_big,
      listeners: formatNumber(Math.floor(Math.random() * 10000000)),
      tracks: data.map((track, index) => ({
        title: track.title,
        plays: formatNumber(Math.floor(Math.random() * 20000000)),
        duration: formatDuration(track.duration),
        explicit: Math.random() > 0.5,
      })),
      playlists: [
        {
          title: `${artist.name} Radio`,
          description: "Playlist",
          image: artist.picture_medium,
        },
      ],
    };

    // 4) Rendo i dati dell'artista
    renderArtistData(artistData);
  } catch (err) {
    console.error(err);
    // In caso di errore, mostro i dati statici
    renderArtistData(SFERA_EBBASTA_DATA);
  }
}

function renderArtistData(artistData) {
  // 1) Imposto il banner con l'immagine dell'artista
  document.getElementById("banner").style.backgroundImage = `url('${artistData.picture}')`;

  // 2) Imposto il nome e gli ascoltatori mensili
  document.getElementById("artist-name").textContent = artistData.name;
  document.getElementById("monthly-listeners").textContent = artistData.listeners;

  // 3) "Play all" - simula l'avvio della riproduzione
  document.getElementById("play-all").addEventListener("click", () => {
    alert(`Riproduzione di ${artistData.name} avviata`);
  });

  // 4) Render brani popolari
  renderPopularTracks(artistData.tracks);

  // 5) Render selezione dell'artista (playlist)
  renderArtistSelection(artistData.playlists);
}

function renderPopularTracks(tracks) {
  const container = document.getElementById("popular-tracks");
  container.innerHTML = "";

  tracks.forEach((track, index) => {
    const trackItem = document.createElement("div");
    trackItem.className = "track-item";

    trackItem.innerHTML = `
      <div class="track-number">${index + 1}</div>
      <div class="track-info">
        <span class="track-title">
          ${track.title}
          ${track.explicit ? '<span class="explicit-label">E</span>' : ""}
        </span>
        <span class="track-artist"></span>
      </div>
      <div class="track-plays">${track.plays}</div>
      <div class="track-duration">${track.duration}</div>
    `;

    trackItem.addEventListener("click", () => {
      alert(`Riproduzione di ${track.title}`);
    });

    container.appendChild(trackItem);
  });
}

function renderArtistSelection(playlists) {
  const container = document.getElementById("artist-selection");
  container.innerHTML = "";

  playlists.forEach((playlist) => {
    const playlistCard = document.createElement("div");
    playlistCard.className = "playlist-card";

    playlistCard.innerHTML = `
      <div class="playlist-image" style="background-image: url('${playlist.image}')"></div>
      <div class="playlist-title">${playlist.title}</div>
      <div class="playlist-description">${playlist.description}</div>
    `;

    playlistCard.addEventListener("click", () => {
      alert(`Apri playlist: ${playlist.title}`);
    });

    container.appendChild(playlistCard);
  });
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function showError(msg) {
  document.getElementById("artist-header").innerHTML = `<p class="error">Errore: ${msg}</p>`;
}
