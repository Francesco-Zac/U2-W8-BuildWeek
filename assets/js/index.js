const API_URL = "https://deezerdevs-deezer.p.rapidapi.com/search";
const API_HEADERS = {
  "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  "x-rapidapi-key": "cc86585e1bmsh8224b8bcd2125cbp1d59afjsnf1a7d7b59fbe",
};

// Query da mostrare
const queries = ["Daft Punk", "Adele", "Coldplay", "Drake", "Taylor Swift"];

const main = document.getElementById("main-content");
let audioPlayer;

window.addEventListener("DOMContentLoaded", () => {
  // Prendo il player audio
  audioPlayer = document.getElementById("audio-player");
  // Creo le strisce
  queries.forEach((q) => createAlbumStrip(q));
});

/**
 * Crea e inserisce una striscia di album per la query passata
 * @param {string} query
 */
async function createAlbumStrip(query) {
  const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: API_HEADERS,
  });
  const json = await response.json();
  const data = json.data || [];

  // Sezione e titolo
  const section = document.createElement("section");
  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = query;
  section.appendChild(title);

  // Riga orizzontale
  const row = document.createElement("div");
  row.className = "album-row";

  data.slice(0, 10).forEach((track) => {
    const album = track.album;
    const previewUrl = track.preview;
    // Card album
    const item = document.createElement("div");
    item.className = "album-item";

    // Al click carico e riproduco il preview
    item.addEventListener("click", () => {
      if (audioPlayer.src !== previewUrl) {
        audioPlayer.src = previewUrl;
      }
      audioPlayer.play();
    });

    // Contenuto card
    const img = document.createElement("img");
    img.src = album.cover_medium;
    img.alt = album.title;

    const albumTitle = document.createElement("div");
    albumTitle.className = "album-title";
    albumTitle.textContent = album.title;

    const artistName = document.createElement("div");
    artistName.className = "artist-name";
    artistName.textContent = track.artist.name;

    item.appendChild(img);
    item.appendChild(albumTitle);
    item.appendChild(artistName);
    row.appendChild(item);
  });

  section.appendChild(row);
  main.appendChild(section);
}
