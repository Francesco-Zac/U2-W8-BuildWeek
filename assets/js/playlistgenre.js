const API_HOST = "deezerdevs-deezer.p.rapidapi.com";
const API_KEY = "dad1558565msh18f5f454539444fp1e8fbajsn8fe0405f9799";
const headers = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

const genresContainer = document.getElementById("genres-container");
const playlistsContainer = document.createElement("div");
playlistsContainer.id = "playlists-container";
document.body.appendChild(playlistsContainer);

genresContainer.addEventListener("click", async (event) => {
  const card = event.target.closest(".card");
  if (!card) return;

  const genreName = card.querySelector("p").innerText;
  playlistsContainer.innerHTML = `<p>Caricamento playlist per ${genreName}...</p>`;

  try {
    const resp = await fetch(`https://${API_HOST}/search/playlist?q=${encodeURIComponent(genreName)}`, { method: "GET", headers });
    if (!resp.ok) throw new Error(resp.status);
    const json = await resp.json();
    displayPlaylists(json.data || []);
  } catch (err) {
    playlistsContainer.innerHTML = "<p>Errore nel caricamento delle playlist.</p>";
    console.error(err);
  }
});

function displayPlaylists(playlists) {
  playlistsContainer.innerHTML = "";
  if (!playlists.length) {
    playlistsContainer.innerHTML = "<p>Nessuna playlist trovata</p>";
    return;
  }

  playlists.forEach((playlist) => {
    const { title, picture_medium, link } = playlist;
    const item = document.createElement("div");
    item.className = "playlist-item";

    item.innerHTML = `
      <a href="${link}" target="_blank">
        <img src="${picture_medium}" alt="${title}">
        <p>${title}</p>
      </a>
    `;

    playlistsContainer.appendChild(item);
  });
}
