const API_HOST = "deezerdevs-deezer.p.rapidapi.com";
const API_KEY = "dad1558565msh18f5f454539444fp1e8fbajsn8fe0405f9799";
const headers = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

const genreIds = [0, 132, 152, 113, 165, 106, 85, 98, 116, 144, 129, 146, 1069, 1292, 1293, 1297];

const searchInput = document.getElementById("search-input");
const genresContainer = document.getElementById("genres-container");
const resultsContainer = document.getElementById("search-results");
const audioPlayer = document.getElementById("audio-player");

window.addEventListener("DOMContentLoaded", () => {
  fetchAllGenres();

  searchInput.addEventListener("input", async () => {
    const q = searchInput.value.trim();
    if (!q) {
      resultsContainer.innerHTML = "";
      genresContainer.style.display = "flex";
      return;
    }

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

/** Fetch parallelo di tutti i generi via API */
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

/** Creazione delle card dei generi con immagine e background dinamico */
function displayGenres(genres) {
  genresContainer.innerHTML = "";
  genres.forEach((genre) => {
    const { name, picture } = genre;
    if (!name || !picture) return;

    const card = document.createElement("div");
    card.className = "card text-white";
    card.style.width = "200px";

    const img = document.createElement("img");
    img.src = picture;
    img.className = "card-img-top";
    img.alt = name;

    const title = document.createElement("h5");
    title.className = "card-title";
    title.innerText = name;

    card.appendChild(img);
    card.appendChild(title);
    genresContainer.appendChild(card);

    setCardBackground(card, img);
  });
}

/** Estrazione colore dominante e applicazione al background della card */
function setCardBackground(card, img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const pixelData = ctx.getImageData(img.width / 2, img.height / 2, 1, 1).data;
    const dominantColor = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;

    card.style.backgroundColor = dominantColor;
  };
}

/** Mostra i risultati della ricerca */
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

document.addEventListener("DOMContentLoaded", () => {
  const genresContainer = document.getElementById("genres-container");

  genresContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    if (!card) return;

    const genreId = card.dataset.id;
    const playlistId = getPlaylistIdForGenre(genreId); // Ottieni l'ID della playlist

    window.location.href = `playlist.html?genre=${genreId}&playlist=${playlistId}`;
  });
});

// Mappa dei generi con ID delle playlist corrispondenti (aggiorna con dati reali)
const playIds = {
  132: 123456, // Pop → ID playlist
  152: 654321, // Rock → ID playlist
  113: 987654, // Jazz → ID playlist
  165: 345678, // Classica → ID playlist
};

function getPlaylistIdForGenre(genreId) {
  return playIds[genreId] || null; // Restituisce l'ID della playlist o null se non trovato
}
