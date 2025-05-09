const API_HOST = "deezerdevs-deezer.p.rapidapi.com";
const API_KEY = "dad1558565msh18f5f454539444fp1e8fbajsn8fe0405f9799";
const headers = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

// Lista di genreId da caricare
const genreIds = [132, 152, 113, 165, 106, 85, 98, 116, 144, 129, 146, 1069, 1292, 1293, 1297];

// Riferimenti al DOM
const searchInput = document.getElementById("search-input");
const genresContainer = document.getElementById("genres-container");
const resultsContainer = document.getElementById("search-results");
const audioPlayer = document.getElementById("audio-player");

// Mappa genere → playlist (aggiorna con i tuoi ID reali)
const playIds = {
  132: 123456,
  152: 908622995,
  113: 987654,
  165: 345678,
};

window.addEventListener("DOMContentLoaded", () => {
  fetchAllGenres();

  // Delegated click sulle card dei generi
  genresContainer.addEventListener("click", (ev) => {
    const card = ev.target.closest(".card");
    if (!card) return;

    const genreId = card.dataset.id;
    const playlistId = playIds[genreId];
    if (!playlistId) {
      alert("Nessuna playlist associata a questo genere.");
      return;
    }

    window.location.href = `playlist.html?genre=${genreId}&playlist=${playlistId}`;
  });
});

/**
 * Fetch parallelo di tutti i generi via API
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
 * Crea le card con ID
 */
function displayGenres(genres) {
  genresContainer.innerHTML = "";

  genres.forEach((genre) => {
    const { id, name, picture_medium } = genre;
    if (!id || !name || !picture_medium) return;

    const card = document.createElement("div");
    card.className = "card text-white";
    card.style.width = "200px";
    card.dataset.id = id;

    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = picture_medium;
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

/**
 * Estrae un colore dominante dall'immagine per fare uno sfondo dinamico
 */
function setCardBackground(card, img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const [r, g, b] = ctx.getImageData(img.width / 2, img.height / 2, 1, 1).data;
    card.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  };
}

/**
 * Mostra i risultati di ricerca
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
