// --- CONFIG RAPIDAPI (stesso che usi sulla home)
const API_URL = "https://deezerdevs-deezer.p.rapidapi.com/search";
const API_HEADERS = {
  "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  "x-rapidapi-key": "cc86585e1bmsh8224b8bcd2125cbp1d59afjsnf1a7d7b59fbe",
};

window.addEventListener("DOMContentLoaded", initArtistPage);

async function initArtistPage() {
  const params = new URLSearchParams(window.location.search);
  const artistQuery = params.get("artist")?.trim();
  if (!artistQuery) {
    showError("Devi passare in URL ?artist=NomeArtista");
    return;
  }

  try {
    // 1) Cerco l’artista e prendo i primi 5 risultati (di default ordinati per popolarità)
    const url = `${API_URL}?q=artist:"${encodeURIComponent(artistQuery)}"&limit=5`;
    const res = await fetch(url, { method: "GET", headers: API_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data = json.data || [];
    if (data.length === 0) {
      showError("Artista non trovato");
      return;
    }

    // 2) Estraggo l’oggetto artist dal primo risultato
    const firstTrack = data[0];
    const artist = firstTrack.artist;

    // 3) Render banner e nome
    document.getElementById("banner").style.backgroundImage = `url('${artist.picture_xl || artist.picture_big}')`;
    document.getElementById("artist-name").textContent = artist.name;

    // 4) “Play all” apre la radio Deezer (tramite URL tracklist)
    document.getElementById("play-all").addEventListener("click", () => {
      if (artist.tracklist) window.open(artist.tracklist, "_blank");
    });

    // 5) Render top 5 tracce
    const container = document.getElementById("popular-tracks");
    container.innerHTML = "";
    data.forEach((t, i) => {
      const a = document.createElement("a");
      a.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center bg-dark text-white";
      a.href = t.link;
      a.target = "_blank";
      a.innerHTML = `
        <div>
          <strong>${i + 1}. ${t.title}</strong><br>
          <small>${t.artist.name}</small>
        </div>
        <i class="fas fa-play-circle"></i>
      `;
      container.append(a);
    });
  } catch (err) {
    console.error(err);
    showError(err.message);
  }
}

function showError(msg) {
  document.getElementById("main-content").innerHTML = `<p class="error">Errore: ${msg}</p>`;
}
