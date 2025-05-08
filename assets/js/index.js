const API_URL = "https://deezerdevs-deezer.p.rapidapi.com/search";
const API_HEADERS = {
  "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  "x-rapidapi-key": "cc86585e1bmsh8224b8bcd2125cbp1d59afjsnf1a7d7b59fbe",
};

// Query da girare alle tre sezioni
const trendingArtists = ["Lazza", "Damiano David", "Fedez", "CLARA", "Tredici Pietro"];
const popularArtists = ["Sfera Ebbasta", "Guè", "Olly", "Marracash", "Achille Lauro", "Lazza", "Cesare Cremonini", "Geolier"];
const popularAlbums = ["Daft Punk", "Adele", "Coldplay", "Drake", "Taylor Swift"];

// Dati di fallback in caso di errori o rate‑limit
const sampleData = {
  artists: [
    { name: "Sfera Ebbasta", picture_medium: "/api/placeholder/300/300?text=Sfera+Ebbasta" },
    { name: "Guè", picture_medium: "/api/placeholder/300/300?text=Gue" },
    { name: "Olly", picture_medium: "/api/placeholder/300/300?text=Olly" },
    { name: "Marracash", picture_medium: "/api/placeholder/300/300?text=Marracash" },
    { name: "Achille Lauro", picture_medium: "/api/placeholder/300/300?text=Achille+Lauro" },
    { name: "Lazza", picture_medium: "/api/placeholder/300/300?text=Lazza" },
    { name: "Cesare Cremonini", picture_medium: "/api/placeholder/300/300?text=Cesare+Cremonini" },
    { name: "Geolier", picture_medium: "/api/placeholder/300/300?text=Geolier" },
  ],
  albums: [
    {
      artist: { name: "Daft Punk" },
      album: { title: "Random Access Memories", cover_medium: "/api/placeholder/300/300?text=Daft+Punk" },
      title: "Get Lucky",
      preview: "",
    },
    {
      artist: { name: "Adele" },
      album: { title: "21", cover_medium: "/api/placeholder/300/300?text=Adele" },
      title: "Rolling in the Deep",
      preview: "",
    },
    {
      artist: { name: "Coldplay" },
      album: { title: "Viva la Vida", cover_medium: "/api/placeholder/300/300?text=Coldplay" },
      title: "Viva la Vida",
      preview: "",
    },
    {
      artist: { name: "Drake" },
      album: { title: "Scorpion", cover_medium: "/api/placeholder/300/300?text=Drake" },
      title: "God's Plan",
      preview: "",
    },
    {
      artist: { name: "Taylor Swift" },
      album: { title: "1989", cover_medium: "/api/placeholder/300/300?text=Taylor+Swift" },
      title: "Blank Space",
      preview: "",
    },
  ],
  tracks: [
    {
      artist: { name: "Lazza" },
      album: { title: "In auto alle 6:00", cover_medium: "/api/placeholder/300/300?text=Lazza" },
      title: "In auto alle 6:00 (feat. Lazza)",
      preview: "",
    },
    {
      artist: { name: "Damiano David" },
      album: { title: "Voices", cover_medium: "/api/placeholder/300/300?text=Damiano+David" },
      title: "Voices",
      preview: "",
    },
    {
      artist: { name: "Fedez" },
      album: { title: "Scelte Stupide", cover_medium: "/api/placeholder/300/300?text=Fedez" },
      title: "Scelte Stupide",
      preview: "",
    },
    {
      artist: { name: "CLARA" },
      album: { title: "Origami all'alba", cover_medium: "/api/placeholder/300/300?text=CLARA" },
      title: "Origami all'alba",
      preview: "",
    },
    {
      artist: { name: "Tredici Pietro" },
      album: { title: "LikethisLikethat", cover_medium: "/api/placeholder/300/300?text=Tredici+Pietro" },
      title: "LikethisLikethat",
      preview: "",
    },
  ],
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

  // 1) Aggiorna la barra di avanzamento
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
      artistData = sampleData;
    } else {
      const json = await res.json();
      const data = json.data || [];
      if (data.length === 0) {
        artistData = sampleData;
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
    renderArtistData(sampleData);
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
  const playerImage = document.getElementById("navbar-player-img");

  if (playTitle) playTitle.textContent = track.title;
  if (playArtist) playArtist.textContent = currentArtistData.name;
  if (playerImage && currentArtistData.picture) {
    playerImage.src = currentArtistData.picture + "?t=" + Date.now();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // 1) inizializzo il player e carico i dati
  audioPlayer = document.getElementById("audio-player");
  loadTrendingTracks();
  loadPopularArtists();
  loadPopularAlbums();

  // 2) setup del play/pausa nella navbar bottom
  const playBtn = document.getElementById("play-btn");
  const playIcon = playBtn.querySelector(".bi-play-circle-fill");
  const pauseIcon = playBtn.querySelector(".bi-pause-circle-fill");

  playBtn.addEventListener("click", () => {
    if (!audioPlayer.src) return;

    if (audioPlayer.paused) {
      audioPlayer.play();
      playIcon.classList.add("d-none");
      pauseIcon.classList.remove("d-none");
    } else {
      audioPlayer.pause();
      pauseIcon.classList.add("d-none");
      playIcon.classList.remove("d-none");
    }
  });

  audioPlayer.addEventListener("ended", () => {
    pauseIcon.classList.add("d-none");
    playIcon.classList.remove("d-none");
  });
});

// +++ 1) Brani di tendenza +++
async function loadTrendingTracks() {
  const container = document.getElementById("trending-tracks");

  for (const artist of trendingArtists) {
    try {
      const res = await fetch(`${API_URL}?q=${encodeURIComponent(artist)}`, {
        method: "GET",
        headers: API_HEADERS,
      });

      if (res.status === 429) throw new Error("Rate limit");

      const { data } = await res.json();
      if (data && data.length > 0) {
        container.appendChild(createTrackCard(data[0]));
      } else {
        throw new Error("Nessun dato");
      }
    } catch (err) {
      console.warn(`Fallback track per ${artist}:`, err);
      // prendi il primo matching o il primo sample
      const mock = sampleData.tracks.find((t) => t.artist.name === artist) || sampleData.tracks[0];
      container.appendChild(createTrackCard(mock));
    }
  }
}

// +++ 2) Artisti popolari +++
async function loadPopularArtists() {
  const container = document.getElementById("popular-artists");

  for (const artist of popularArtists) {
    try {
      const res = await fetch(`${API_URL}?q=${encodeURIComponent(artist)}`, {
        method: "GET",
        headers: API_HEADERS,
      });

      if (res.status === 429) throw new Error("Rate limit");

      const { data } = await res.json();
      if (data && data.length > 0) {
        // l'oggetto vero si trova in data[0].artist
        container.appendChild(createArtistCard(data[0].artist));
      } else {
        throw new Error("Nessun dato");
      }
    } catch (err) {
      console.warn(`Fallback artist per ${artist}:`, err);
      const mock = sampleData.artists.find((a) => a.name === artist) || sampleData.artists[0];
      container.appendChild(createArtistCard(mock));
    }

    await new Promise((r) => setTimeout(r, 300));
  }
}

// +++ 3) Album e singoli popolari +++
async function loadPopularAlbums() {
  const container = document.getElementById("popular-albums");

  for (const query of popularAlbums) {
    try {
      const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: API_HEADERS,
      });

      if (res.status === 429) throw new Error("Rate limit");

      const { data } = await res.json();
      if (data && data.length > 0) {
        const albumData = {
          id: data[0].album.id,
          album: data[0].album,
          artist: data[0].artist,
        };
        container.appendChild(createAlbumCard(albumData));
      } else {
        throw new Error("Nessun dato");
      }
    } catch (err) {
      console.warn(`Fallback album per ${query}:`, err);
      const mock = sampleData.albums.find((a) => a.artist.name === query) || sampleData.albums[0];
      mock.id = Math.floor(Math.random() * 1000000); // ID casuale per i dati di fallback
      container.appendChild(createAlbumCard(mock));
    }

    await new Promise((r) => setTimeout(r, 300));
  }
}

function createTrackCard(track) {
  const item = document.createElement("div");
  item.className = "track-item";

  item.addEventListener("click", () => {
    if (track.preview && audioPlayer.src !== track.preview) {
      audioPlayer.src = track.preview;
      audioPlayer.play();

      const playerImg = document.getElementById("navbar-player-img");
      if (playerImg) {
        const coverUrl = track.album.cover_medium || "./assets/img/image-2.jpg";
        playerImg.src = coverUrl + "?t=" + Date.now();
      }
    }
  });

  if (track.album.cover_medium) {
    const img = document.createElement("img");
    img.src = track.album.cover_medium;
    img.alt = track.title;
    img.className = "track-cover";
    item.appendChild(img);
  } else {
    const coverFallback = document.createElement("div");
    coverFallback.className = "track-cover cover-fallback";
    const hash = simpleHash(track.artist.name);
    coverFallback.style.backgroundColor = `hsl(${hash % 360}, 70%, 60%)`;
    const initials = track.artist.name
      .split(" ")
      .map((n) => n[0])
      .join("");
    coverFallback.textContent = initials;
    item.appendChild(coverFallback);
  }

  const info = document.createElement("div");
  info.className = "track-info";
  const title = document.createElement("div");
  title.className = "track-title";
  title.textContent = track.title;
  const artistName = document.createElement("div");
  artistName.className = "track-artist";
  artistName.textContent = track.artist.name;
  artistName.style.cursor = "pointer";
  artistName.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = `artistpage.html?artist=${encodeURIComponent(track.artist.name)}`;
  });

  info.append(title, artistName);
  item.appendChild(info);

  return item;
}

function createArtistCard(artist) {
  const item = document.createElement("div");
  item.className = "artist-item";
  item.addEventListener("click", () => {
    window.location.href = `artistpage.html?artist=${encodeURIComponent(artist.name)}`;
  });

  if (artist.picture_medium) {
    const img = document.createElement("img");
    img.src = artist.picture_medium;
    img.alt = artist.name;
    img.className = "artist-image";
    item.appendChild(img);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "artist-image artist-fallback";
    const hash = simpleHash(artist.name);
    fallback.style.backgroundColor = `hsl(${hash % 360}, 70%, 60%)`;
    const initials = artist.name
      .split(" ")
      .map((n) => n[0])
      .join("");
    fallback.textContent = initials;
    item.appendChild(fallback);
  }

  const name = document.createElement("div");
  name.className = "artist-name";
  name.textContent = artist.name;
  const label = document.createElement("div");
  label.className = "artist-label";
  label.textContent = "Artista";

  item.append(name, label);
  return item;
}

function createAlbumCard(data) {
  const album = data.album;
  const albumId = data.id;
  const item = document.createElement("div");
  item.className = "album-item";
  item.dataset.albumId = albumId; // Memorizza l'ID dell'album nell'elemento HTML

  item.addEventListener("click", () => {
    // Reindirizza alla pagina dell'album passando l'ID
    window.location.href = `albumpage.html?id=${albumId}`;
  });

  if (album.cover_medium) {
    const img = document.createElement("img");
    img.src = album.cover_medium;
    img.alt = album.title;
    img.className = "album-cover";
    item.appendChild(img);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "album-cover cover-fallback";
    const hash = simpleHash(data.artist.name + album.title);
    fallback.style.backgroundColor = `hsl(${hash % 360}, 70%, 60%)`;
    const initials = album.title
      .split(" ")
      .map((n) => n[0])
      .join("");
    fallback.textContent = initials;
    item.appendChild(fallback);
  }

  const titleDiv = document.createElement("div");
  titleDiv.className = "album-title";
  titleDiv.textContent = album.title;

  const artistDiv = document.createElement("div");
  artistDiv.className = "artist-name";
  artistDiv.textContent = data.artist.name;
  artistDiv.style.cursor = "pointer";

  artistDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = `artistpage.html?artist=${encodeURIComponent(data.artist.name)}`;
  });

  item.append(titleDiv, artistDiv);
  return item;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
