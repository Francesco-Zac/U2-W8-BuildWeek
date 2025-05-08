const API_URL = "https://deezerdevs-deezer.p.rapidapi.com/search";
const API_HEADERS = {
  "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  "x-rapidapi-key": "cc86585e1bmsh8224b8bcd2125cbp1d59afjsnf1a7d7b59fbe",
};

const SFERA_EBBASTA_DATA = {
  name: "Sfera Ebbasta",
  picture: "https://e-cdns-images.dzcdn.net/images/artist/0140defb5b1a3fba8dc78019ed08a3c0/1000x1000-000000-80-0-0.jpg",
  listeners: "7.095.401",
  tracks: [
    { title: "NEON", plays: "17.797.520", duration: "3:46", explicit: true },
    { title: "NON METTERCI BECCO", plays: "12.379.863", duration: "3:02", explicit: true },
    { title: "SEI PERSA", plays: "8.374.373", duration: "2:58", explicit: true },
    { title: "MOLECOLE SPRITE", plays: "7.805.670", duration: "2:54", explicit: true },
    { title: "SNTMNG", plays: "7.509.373", duration: "3:12", explicit: true },
  ],
  playlists: [{ title: "SANTANA MONEY GANG", description: "Playlist", image: "https://i.scdn.co/image/ab67706c0000da84a0147c2e2128952a285a9efa" }],
};

let audio;
let currentArtistData = null;
let playlistTracks = [];
let currentIndex = 0;
let isPlaying = false;

window.addEventListener("DOMContentLoaded", initArtistPage);

async function initArtistPage() {
  audio = document.getElementById("audio-player");

  // Riferimenti
  const progressContainer = document.getElementById("progress-container");
  const trackBar = document.getElementById("track-bar");
  const trackTime = document.getElementById("track-time");
  const trackMax = document.getElementById("track-max");

  const volumeContainer = document.getElementById("volume-container");
  const volumeBar = document.getElementById("volume-bar");
  const volumeBtn = document.getElementById("volume-btn");

  // 1) Aggiorna la barra di avanzamento mentre il brano scorre
  audio.addEventListener("loadedmetadata", () => {
    const dur = audio.duration;
    trackMax.textContent = formatTime(dur);
  });
  audio.addEventListener("timeupdate", () => {
    const cur = audio.currentTime;
    const percent = (cur / audio.duration) * 100;
    trackBar.style.width = percent + "%";
    trackTime.textContent = formatTime(cur);
  });

  // 2) Click sul contenitore per fare seek
  progressContainer.addEventListener("click", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audio.duration;
    audio.currentTime = newTime;
  });

  // 3) Inizializza volume
  audio.volume = 0.25;

  // 4) Click sul volume-container per cambiare volume
  volumeContainer.addEventListener("click", (e) => {
    const rect = volumeContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newVol = clickX / width;
    audio.volume = newVol;
    volumeBar.style.width = newVol * 100 + "%";
  });

  // 5) Pulsante mute/unmute
  let lastVolume = audio.volume;
  volumeBtn.addEventListener("click", () => {
    if (audio.volume > 0) {
      lastVolume = audio.volume;
      audio.volume = 0;
      volumeBar.style.width = "0%";
    } else {
      audio.volume = lastVolume;
      volumeBar.style.width = lastVolume * 100 + "%";
    }
  });

  // Funzione di utilità per formattare mm:ss
  function formatTime(sec) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(1, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }

  // Bind all player controls
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const shuffleBtn = document.getElementById("shuffle-btn");
  const playBtn = document.getElementById("play-btn");

  if (prevBtn) prevBtn.addEventListener("click", prevTrack);
  if (nextBtn) nextBtn.addEventListener("click", nextTrack);
  if (shuffleBtn) shuffleBtn.addEventListener("click", shuffleTrack);
  if (playBtn) playBtn.addEventListener("click", togglePlay);

  if (audio) {
    audio.addEventListener("ended", () => {
      isPlaying = false;
      updatePlayIcon();
      nextTrack();
    });

    audio.addEventListener("play", () => {
      isPlaying = true;
      updatePlayIcon();
    });

    audio.addEventListener("pause", () => {
      isPlaying = false;
      updatePlayIcon();
    });
  }

  const params = new URLSearchParams(window.location.search);
  const artistQuery = params.get("artist")?.trim() || "Sfera Ebbasta";

  try {
    const url = `${API_URL}?q=artist:"${encodeURIComponent(artistQuery)}"&limit=10`;
    const res = await fetch(url, { method: "GET", headers: API_HEADERS });
    let artistData;

    if (!res.ok) {
      artistData = SFERA_EBBASTA_DATA;
    } else {
      const json = await res.json();
      const data = json.data || [];
      if (data.length === 0) {
        artistData = SFERA_EBBASTA_DATA;
      } else {
        const artist = data[0].artist;
        artistData = {
          name: artist.name,
          picture: artist.picture_xl || artist.picture_big,
          listeners: formatNumber(Math.floor(Math.random() * 10000000)),
          tracks: data.map((t) => ({
            title: t.title,
            plays: formatNumber(Math.floor(Math.random() * 20000000)),
            duration: formatDuration(t.duration),
            explicit: Math.random() > 0.5,
            preview: t.preview,
          })),
          playlists: [
            {
              title: artist.name + " Radio",
              description: "Playlist",
              image: artist.picture_medium,
            },
          ],
        };
      }
    }

    renderArtistData(artistData);
  } catch (err) {
    console.error(err);
    renderArtistData(SFERA_EBBASTA_DATA);
  }
}

function renderArtistData(artistData) {
  currentArtistData = artistData;
  playlistTracks = artistData.tracks.slice();
  currentIndex = 0;

  // banner & meta
  document.getElementById("banner").style.backgroundImage = `url('${artistData.picture}')`;
  document.getElementById("artist-name").textContent = artistData.name;
  document.getElementById("monthly-listeners").textContent = artistData.listeners;

  document.getElementById("play-all").onclick = () => {
    if (!playlistTracks.length) return;
    currentIndex = 0;
    playCurrent();
  };

  renderPopularTracks(playlistTracks);
  renderArtistSelection(artistData.playlists);

  //Player UI
  updatePlayerInfo();
}

function renderPopularTracks(tracks) {
  const container = document.getElementById("popular-tracks");
  container.innerHTML = "";
  tracks.forEach((track, idx) => {
    const item = document.createElement("div");
    item.className = "track-item";
    item.innerHTML = `
      <div class="track-number">${idx + 1}</div>
      <div class="track-info">
        <span class="track-title">
          ${track.title}${track.explicit ? '<span class="explicit-label">E</span>' : ""}
        </span>
      </div>
      <div class="track-plays">${track.plays}</div>
      <div class="track-duration">${track.duration}</div>
    `;
    item.addEventListener("click", () => {
      currentIndex = idx;
      playCurrent();
    });
    container.appendChild(item);
  });
}

function renderArtistSelection(playlists) {
  const container = document.getElementById("artist-selection");
  container.innerHTML = "";
  playlists.forEach((pl) => {
    const card = document.createElement("div");
    card.className = "playlist-card";
    card.innerHTML = `
      <div class="playlist-image" style="background-image: url('${pl.image}')"></div>
      <div class="playlist-title">${pl.title}</div>
      <div class="playlist-description">${pl.description}</div>
    `;
    card.onclick = () => alert(`Apri playlist: ${pl.title}`);
    container.appendChild(card);
  });
}

function togglePlay() {
  if (!audio || !playlistTracks.length) return;

  if (audio.src && !audio.src.endsWith("undefined")) {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  } else {
    playCurrent();
  }
}

function playCurrent() {
  if (!currentArtistData || !audio || !playlistTracks.length) return;

  const track = playlistTracks[currentIndex];
  if (!track || !track.preview) {
    console.error("Invalid track or preview URL");
    return;
  }

  audio.src = track.preview;
  audio.play().catch((err) => {
    console.error("Failed to play track:", err);
  });

  updatePlayerInfo();
}

function updatePlayerInfo() {
  if (!playlistTracks.length) return;

  const track = playlistTracks[currentIndex];
  if (!track) return;

  const playTitle = document.getElementById("play-title");
  const playArtist = document.getElementById("play-artist");
  const playerImage = document.querySelector("#navbar-bottom img");

  if (playTitle) playTitle.textContent = track.title;
  if (playArtist) playArtist.textContent = currentArtistData.name;
  if (playerImage && currentArtistData.picture) playerImage.src = currentArtistData.picture;
}

function prevTrack() {
  if (!playlistTracks.length) return;
  currentIndex = (currentIndex - 1 + playlistTracks.length) % playlistTracks.length;
  playCurrent();
}

function nextTrack() {
  if (!playlistTracks.length) return;
  currentIndex = (currentIndex + 1) % playlistTracks.length;
  playCurrent();
}

function shuffleTrack() {
  if (playlistTracks.length < 2) return;
  let idx;
  do {
    idx = Math.floor(Math.random() * playlistTracks.length);
  } while (idx === currentIndex);
  currentIndex = idx;
  playCurrent();
}

function updatePlayIcon() {
  const playIcon = document.querySelector("#play-btn .bi-play-circle-fill");
  const pauseIcon = document.querySelector("#play-btn .bi-pause-circle-fill");

  if (playIcon && pauseIcon) {
    playIcon.classList.toggle("d-none", isPlaying);
    pauseIcon.classList.toggle("d-none", !isPlaying);
  }
}

function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60),
    s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
