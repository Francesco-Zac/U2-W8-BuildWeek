const API_HOST = "deezerdevs-deezer.p.rapidapi.com";
const API_KEY = "dad1558565msh18f5f454539444fp1e8fbajsn8fe0405f9799";
const headers = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

// Lista di tutti gli ID di genere Deezer
const genreIds = [0, 132, 152, 113, 165, 106, 85, 98, 116, 144, 129, 146, 1069, 1292, 1293, 1297];

const searchInput = document.getElementById("search-input");
const genresContainer = document.getElementById("genres-container");
const resultsContainer = document.getElementById("search-results");
const audioPlayer = document.getElementById("audio-player");

window.addEventListener("DOMContentLoaded", () => {
  // Carica subito tutti i generi
  fetchAllGenres();

  // Imposta la ricerca live
  searchInput.addEventListener("input", async () => {
    const q = searchInput.value.trim();
    if (!q) {
      // reset: mostra generi
      resultsContainer.innerHTML = "";
      genresContainer.style.display = "flex";
      return;
    }

    // nascondi generi e mostra loader
    genresContainer.style.display = "none";
    resultsContainer.innerHTML = "<p>Caricamento risultati…</p>";

    try {
      const resp = await fetch(`https://${API_HOST}/search?q=${encodeURIComponent(q)}`, { method: "GET", headers });
      if (!resp.ok) throw new Error(resp.status);
      const json = await resp.json();
      renderSearchResults(json.data || []);
    } catch (err) {
      resultsContainer.innerHTML = "<p>Errore nel caricamento.</p>";
      console.error(err);
    }
  });
});

/**
 * Fetch parallelo di tutti i generi via RapidAPI (/genre/{id})
 */
async function fetchAllGenres() {
  const calls = genreIds.map((id) =>
    fetch(`https://${API_HOST}/genre/${id}`, { method: "GET", headers }).then((r) => {
      if (!r.ok) throw new Error(`ID ${id}: ${r.status}`);
      return r.json();
    })
  );

  try {
    const genres = await Promise.all(calls);
    displayGenres(genres);
  } catch (err) {
    console.error("Errore fetch generi:", err);
    genresContainer.innerHTML = "<p>Impossibile caricare i generi.</p>";
  }
}

/**
 * Crea le card dei generi dentro #genres-container
 * @param {Array} genres
 */
function displayGenres(genres) {
  genresContainer.innerHTML = "";
  genres.forEach((genre) => {
    const { name, picture } = genre;
    if (!name || !picture) return;

    const card = document.createElement("div");
    card.className = "card m-2 bg-secondary text-white";
    card.style.width = "200px";
    card.innerHTML = `
      <img src="${picture}" class="card-img-top" alt="${name}">
      <div class="card-body">
        <h5 class="card-title text-center">${name}</h5>
      </div>
    `;
    genresContainer.appendChild(card);
  });
}

/**
 * Mostra i risultati della ricerca
 * @param {Array} tracks
 */
function renderSearchResults(tracks) {
  resultsContainer.innerHTML = "";
  if (!tracks.length) {
    resultsContainer.innerHTML = "<p>Nessun risultato</p>";
    return;
  }

  tracks.slice(0, 20).forEach((track) => {
    const { album, artist, preview } = track;
    const item = document.createElement("div");
    item.className = "album-item search-item";

    item.innerHTML = `
      <img src="${album.cover_medium}" alt="${album.title}">
      <div class="search-info">
        <div class="album-title">${album.title}</div>
        <div class="artist-name">${artist.name}</div>
      </div>
    `;

    item.addEventListener("click", () => {
      audioPlayer.src = preview;
      audioPlayer.play();
    });

    resultsContainer.appendChild(item);
  });
}
