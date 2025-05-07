const params = new URLSearchParams(window.location.search);
const albumId = params.get("id");

if (albumId) {
  const url = `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "3a3a3aac9amsh7f42524dfcd2095p1b26b2jsn11746df15d07",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com"
    }
  };

  const fetchAlbumData = async () => {
    try {
      const response = await fetch(url, options);
      const album = await response.json();

      // Aggiorna dinamicamente il contenuto della pagina
      document.getElementById("clicked-album-title").textContent = album.title;
      document.getElementById("clicked-album-cover").src = album.cover_big;
      document.getElementById("clicked-album-artist").textContent = album.artist.name;

      const trackList = document.getElementById("clicked-album-tracks");
      trackList.innerHTML = "";
      album.tracks.data.forEach((track) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${track.title} (${track.duration}s)`;
        trackList.appendChild(li);
      });
    } catch (error) {
      console.error("Errore nel recupero dei dati dell'album:", error);
    }
  };

  fetchAlbumData();
} else {
  console.error("ID dell'album non fornito nella query string.");
}
