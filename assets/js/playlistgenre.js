const API_HOST = "deezerdevs-deezer.p.rapidapi.com";
const API_KEY = "dad1558565msh18f5f454539444fp1e8fbajsn8fe0405f9799";
const headers = {
  "x-rapidapi-host": API_HOST,
  "x-rapidapi-key": API_KEY,
};

// Selezione degli elementi HTML
const playlistBanner = document.getElementById("playlist-banner");
const playlistTitle = document.getElementById("playlist-title");
const trackList = document.getElementById("track-list");

// Player controls
const playBtn1 = document.getElementById("play-btn");
const playTitle = document.getElementById("play-title");
const playArtist = document.getElementById("play-artist");
const heartBtn1 = document.getElementById("heart-btn");
const trackTime = document.getElementById("track-time");
const trackMax = document.getElementById("track-max");
const progressBar = document.querySelector(".progress-bar");
const volumeBtn1 = document.getElementById("volume-btn");
const volumeIcon = document.getElementById("volume-icon");
const volumeMute1 = document.getElementById("volume-mute");
const volumeBar1 = document.getElementById("volume-bar");

let audioPlayer = new Audio();
let currentTrackIndex = 0;
let currentPlaylist = [];
let isPlaying = false;
let isMuted = false;
let currentVolume = 50;

const urlParams = new URLSearchParams(window.location.search);
const playlistId = urlParams.get("playlist");

function init() {
  audioPlayer.volume = currentVolume / 100;
  volumeBar1.style.width = `${currentVolume}%`;

  playBtn1.addEventListener("click", togglePlay);
  volumeBtn1.addEventListener("click", toggleMute);
  heartBtn1.addEventListener("click", toggleLike);

  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener("ended", playNext);

  if (playlistId) {
    fetchPlaylistDetails(playlistId);
  } else {
    playlistTitle.innerText = "Playlist non specificata";
  }
}

// Funzione per ottenere e mostrare i dettagli della playlist
async function fetchPlaylistDetails(playlistId) {
  try {
    const res = await fetch(`https://${API_HOST}/playlist/${playlistId}`, { method: "GET", headers });
    if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);
    const playlistData = await res.json();

    currentPlaylist = playlistData.tracks.data;

    playlistBanner.style.backgroundImage = `url(${playlistData.picture_xl})`;
    playlistTitle.innerText = playlistData.title;

    displayTrackList(playlistData.tracks.data);

    if (currentPlaylist.length > 0) {
      prepareTrack(0);
    }
  } catch (error) {
    console.error("Errore nel caricamento della playlist:", error);
    playlistTitle.innerText = "Errore nel caricamento della playlist.";
  }
}

function displayTrackList(tracks) {
  trackList.innerHTML = "";
  if (tracks.length === 0) {
    trackList.innerHTML = "<li>Nessuna traccia disponibile.</li>";
    return;
  }

  tracks.forEach((track, index) => {
    const trackItem = document.createElement("li");
    trackItem.className = "track-item";
    trackItem.innerHTML = `
      <div class="track-info">
        <span class="track-number">${index + 1}.</span>
        <span class="track-title">${track.title}</span>
        <span class="track-artist">${track.artist.name}</span>
      </div>
    `;
    trackItem.addEventListener("click", () => {
      loadTrack(index);
      playTrack();
    });
    trackList.appendChild(trackItem);
  });
}

function prepareTrack(index) {
  if (index >= 0 && index < currentPlaylist.length) {
    currentTrackIndex = index;
    const track = currentPlaylist[index];

    audioPlayer.src = track.preview;

    playTitle.textContent = track.title;
    playArtist.textContent = track.artist.name;

    trackMax.textContent = formatTime(30);

    trackTime.textContent = "0:00";
    progressBar.style.width = "0%";
  }
}

function loadTrack(index) {
  prepareTrack(index);

  const trackItems = trackList.querySelectorAll(".track-item");
  trackItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function togglePlay() {
  if (currentPlaylist.length === 0) return;

  const playIcon = playBtn1.querySelector(".bi-play-circle-fill");
  const pauseIcon = playBtn1.querySelector(".bi-pause-circle-fill");

  if (isPlaying) {
    audioPlayer.pause();
    playIcon.classList.remove("d-none");
    pauseIcon.classList.add("d-none");
    isPlaying = false;
  } else {
    audioPlayer.play();
    playIcon.classList.add("d-none");
    pauseIcon.classList.remove("d-none");
    isPlaying = true;
  }
}

function playTrack() {
  audioPlayer.play();
  isPlaying = true;
  const playIcon = playBtn1.querySelector(".bi-play-circle-fill");
  const pauseIcon = playBtn1.querySelector(".bi-pause-circle-fill");
  playIcon.classList.add("d-none");
  pauseIcon.classList.remove("d-none");
}

function playNext() {
  if (currentPlaylist.length === 0) return;

  const nextIndex = (currentTrackIndex + 1) % currentPlaylist.length;
  loadTrack(nextIndex);

  if (isPlaying) {
    playTrack();
  }
}

function playPrev() {
  if (currentPlaylist.length === 0) return;

  const prevIndex = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  loadTrack(prevIndex);

  if (isPlaying) {
    playTrack();
  }
}

// Aggiorna la progress bar durante la riproduzione
function updateProgress() {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration || 30;

  trackTime.textContent = formatTime(currentTime);

  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function toggleMute() {
  if (isMuted) {
    audioPlayer.volume = currentVolume / 100;
    volumeIcon.classList.remove("d-none");
    volumeMute1.classList.add("d-none");
    volumeBar1.style.width = `${currentVolume}%`;
  } else {
    audioPlayer.volume = 0;
    volumeIcon.classList.add("d-none");
    volumeMute1.classList.remove("d-none");
    volumeBar1.style.width = "0%";
  }
  isMuted = !isMuted;
}

function toggleLike() {
  const heart = heartBtn1.querySelector(".bi-heart");
  const heartFill = heartBtn1.querySelector(".bi-heart-fill");

  if (heart.classList.contains("opacity-0")) {
    heart.classList.remove("opacity-0");
    heartFill.classList.add("opacity-0");
  } else {
    heart.classList.add("opacity-0");
    heartFill.classList.remove("opacity-0");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const prevBtn = document.querySelector('button svg path[d^="M3.3 1a.7"]').parentNode.parentNode;
  prevBtn.addEventListener("click", playPrev);

  const nextBtn = document.querySelector('button svg path[d^="M12.7 1a.7"]').parentNode.parentNode;
  nextBtn.addEventListener("click", playNext);

  init();
  const volumeContainer = volumeBar1.parentElement;
  let isVolumeDragging = false;

  function setVolumeFromEvent(e) {
    const rect = volumeContainer.getBoundingClientRect();
    let pct = (e.clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    currentVolume = Math.round(pct * 100);
    audioPlayer.volume = currentVolume / 100;
    volumeBar1.style.width = `${currentVolume}%`;

    if (isMuted && currentVolume > 0) {
      isMuted = false;
      volumeIcon.classList.remove("d-none");
      volumeMute1.classList.add("d-none");
    }

    if (currentVolume === 0) {
      volumeIcon.classList.add("d-none");
      volumeMute1.classList.remove("d-none");
    } else {
      volumeIcon.classList.remove("d-none");
      volumeMute1.classList.add("d-none");
    }
  }

  volumeContainer.addEventListener("click", (e) => {
    setVolumeFromEvent(e);
  });

  volumeContainer.addEventListener("mousedown", (e) => {
    isVolumeDragging = true;
    setVolumeFromEvent(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isVolumeDragging) {
      setVolumeFromEvent(e);
    }
  });

  document.addEventListener("mouseup", () => {
    isVolumeDragging = false;
  });
});
