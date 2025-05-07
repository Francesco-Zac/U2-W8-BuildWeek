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

      document.getElementById("clicked-album-title").textContent = album.title;
      document.getElementById("clicked-album-cover").src = album.cover_big;
      document.getElementById("clicked-album-artist").textContent = album.artist.name;

      const trackList = document.getElementById("clicked-album-tracks");
      trackList.innerHTML = "";
      album.tracks.data.forEach((track) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.style.backgroundColor = "inherit";

        const minutes = Math.floor(track.duration / 60);
        const seconds = track.duration % 60;
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        li.textContent = track.title;

        const durationSpan = document.createElement("span");
        durationSpan.className = "badge bg-secondary rounded-pill";
        durationSpan.textContent = formattedDuration;

        li.appendChild(durationSpan);
        trackList.appendChild(li);
      });
      // Aggiungi funzionalità al pulsante Play
      const playButton = document.getElementById("play-album-btn");
      playButton.addEventListener("click", () => {
        if (album.tracks.data.length > 0) {
          const firstTrackPreview = album.tracks.data[0].preview;
          const audioPlayer = new Audio(firstTrackPreview);
          audioPlayer.play();
        } else {
          alert("No preview available for this album.");
        }
      });
    } catch (error) {
      console.error("Errore nel recupero dei dati dell'album:", error);
    }
  };

  fetchAlbumData();
} else {
  console.error("ID dell'album non fornito nella query string.");
}
