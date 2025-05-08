const API_HOST = "deezerdevs-deezer.p.rapidapi.com";
const API_KEY = "dad1558565msh18f5f454539444fp1e8fbajsn8fe0405f9799";
const headers = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

// Selezione degli elementi HTML
const playlistBanner = document.getElementById("playlist-banner");
const playlistTitle = document.getElementById("playlist-title");
const playBtn = document.getElementById("play-btn");
const trackList = document.getElementById("track-list");

// Recupero parametri dall'URL
const urlParams = new URLSearchParams(window.location.search);
const playlistId = urlParams.get("playlist");

// Se è presente il playlistId, carico i dettagli della playlist
if (playlistId) {
  fetchPlaylistDetails(playlistId);
} else {
  playlistTitle.innerText = "Playlist non specificata";
}

// Funzione per ottenere e mostrare i dettagli della playlist
async function fetchPlaylistDetails(playlistId) {
  try {
    const res = await fetch(`https://${API_HOST}/playlist/${playlistId}`, { method: "GET", headers });
    if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);
    const playlistData = await res.json();

    // Aggiorno l'immagine di sfondo e il titolo della playlist
    playlistBanner.style.backgroundImage = `url(${playlistData.picture_xl})`;
    playlistTitle.innerText = playlistData.title;

    // La funzione del bottone Play può essere definita separatamente
    playBtn.onclick = () => {
      console.log("Play button clicked! Aggiungi funzionalità qui.");
    };

    // Genero la lista delle tracce
    displayTrackList(playlistData.tracks.data);
  } catch (error) {
    console.error("Errore nel caricamento della playlist:", error);
    playlistTitle.innerText = "Errore nel caricamento della playlist.";
  }
}

// Funzione per creare la lista delle tracce
function displayTrackList(tracks) {
  trackList.innerHTML = ""; // Pulisce la lista esistente
  if (tracks.length === 0) {
    trackList.innerHTML = "<li>Nessuna traccia disponibile.</li>";
    return;
  }

  tracks.forEach((t, index) => {
    const trackItem = document.createElement("li");
    trackItem.innerHTML = `<span>${index + 1}.</span> ${t.artist.name} – ${t.title}`;
    trackList.appendChild(trackItem);
  });
}
