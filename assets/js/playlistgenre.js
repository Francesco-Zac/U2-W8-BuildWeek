const API_HOST = "deezerdevs-deezer.p.rapidapi.com";
const API_KEY = "dad1558565msh18f5f454539444fp1e8fbajsn8fe0405f9799";
const headers = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

const playlistsContainer = document.getElementById("playlists-container");
const genreTitle = document.getElementById("genre-title");

// Recupera il genere e la playlist dalla query string
const urlParams = new URLSearchParams(window.location.search);
const genreId = urlParams.get("genre");
const playlistId = urlParams.get("playlist");

// Se è presente il genre, carico nome genere e playlist
if (genreId) {
  fetchGenreName(genreId);
  fetchPlaylistDetails(playlistId);
} else {
  genreTitle.innerText = "Genere non specificato";
}

// Funzione per ottenere e mostrare il nome del genere
async function fetchGenreName(genreId) {
  try {
    const resp = await fetch(`https://${API_HOST}/genre/${genreId}`, {
      method: "GET",
      headers,
    });
    if (!resp.ok) throw new Error(`Errore HTTP: ${resp.status}`);
    const data = await resp.json();
    genreTitle.innerText = `Playlist per il genere: ${data.name}`;
  } catch (err) {
    console.error("Errore nel recupero del nome del genere:", err);
    genreTitle.innerText = "Impossibile recuperare il nome del genere.";
  }
}

// Funzione per ottenere e mostrare i dettagli della playlist
async function fetchPlaylistDetails(playlistId) {
  if (!playlistId) {
    playlistsContainer.innerHTML = "<p>Playlist non specificata.</p>";
    return;
  }

  try {
    const res = await fetch(`https://${API_HOST}/playlist/${playlistId}`, { method: "GET", headers });
    if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);
    const playlistData = await res.json();
    console.log("playlistData =", playlistData);

    const tracksArray = playlistData.tracks?.data || [];
    displayPlaylist(playlistData, tracksArray);
  } catch (error) {
    console.error("Errore nel caricamento della playlist:", error);
    playlistsContainer.innerHTML = "<p>Errore nel caricamento della playlist.</p>";
  }
}

// Funzione per renderizzare la playlist e le tracce nella pagina
function displayPlaylist(playlist, tracks) {
  let html = "<ul>";
  if (tracks.length) {
    tracks.forEach((t) => {
      html += `<li>${t.artist.name} – ${t.title}</li>`;
    });
  } else {
    html += "<li>Nessuna traccia disponibile in questa playlist.</li>";
  }
  html += "</ul>";

  playlistsContainer.innerHTML = `
    <div class="playlist-details">
      <h3>${playlist.title}</h3>
      <img src="${playlist.picture_medium}" alt="${playlist.title}">
      <h4>Lista delle tracce:</h4>
      ${html}
    </div>
  `;
}
