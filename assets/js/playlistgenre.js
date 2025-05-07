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

if (genreId) {
  fetchGenreName(genreId);
  fetchPlaylistDetails(playlistId);
}

// Ottieni il nome del genere
async function fetchGenreName(genreId) {
  try {
    const response = await fetch(`https://${API_HOST}/genre/${genreId}`, { method: "GET", headers });
    const data = await response.json();
    genreTitle.innerText = `Playlist per il genere: ${data.name}`;
  } catch (error) {
    console.error("Errore nel recupero del nome del genere:", error);
  }
}

// Recupera i dettagli della playlist e le sue tracce
async function fetchPlaylistDetails(playlistId) {
  if (!playlistId) {
    playlistsContainer.innerHTML = "<p>Nessuna playlist disponibile per questo genere.</p>";
    return;
  }

  try {
    const playlistResponse = await fetch(`https://${API_HOST}/playlist/${playlistId}`, { method: "GET", headers });
    if (!playlistResponse.ok) throw new Error(`Errore HTTP (Playlist): ${playlistResponse.status}`);
    const playlistData = await playlistResponse.json();

    const tracksResponse = await fetch(`https://${API_HOST}/playlist/${playlistId}/tracks`, { method: "GET", headers });
    if (!tracksResponse.ok) throw new Error(`Errore HTTP (Tracce): ${tracksResponse.status}`);
    const tracksData = await tracksResponse.json();

    displayPlaylist(playlistData, tracksData.data);
  } catch (error) {
    console.error("Errore nel caricamento della playlist e/o delle tracce:", error);
    playlistsContainer.innerHTML = "<p>Errore nel caricamento della playlist.</p>";
  }
}

// Mostra i dettagli della playlist e le sue tracce
function displayPlaylist(playlist, tracks) {
  let tracksListHTML = "<ul>";
  if (tracks && tracks.length > 0) {
    tracks.forEach((track) => {
      tracksListHTML += `<li>${track.artist.name} - ${track.title}</li>`;
    });
  } else {
    tracksListHTML += "<li>Nessuna traccia disponibile in questa playlist.</li>";
  }
  tracksListHTML += "</ul>";

  playlistsContainer.innerHTML = `
    <div class="playlist-details">
      <h3>${playlist.title}</h3>
      <img src="${playlist.picture_medium}" alt="${playlist.title}">
      <p><a href="${playlist.link}" target="_blank">Ascolta su Deezer</a></p>
      <h4>Lista delle tracce:</h4>
      ${tracksListHTML}
    </div>
  `;
}
