let audioPlayer = null;
let currentTrackIndex = 0;
let albumTracks = [];
let isPlaying = false;

const playBtn1 = document.getElementById("play-btn");
const playIcon = playBtn1.querySelector(".bi-play-circle-fill");
const pauseIcon = playBtn1.querySelector(".bi-pause-circle-fill");
const prevBtn = document.querySelector(
  'button svg[viewBox="0 0 16 16"]:has(path[d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"])'
).parentElement;
const nextBtn = document.querySelector(
  'button svg[viewBox="0 0 16 16"]:has(path[d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"])'
).parentElement;
const volumeBtn1 = document.getElementById("volume-btn");
const volumeIcon = document.getElementById("volume-icon");
const volumeMuteIcon = document.getElementById("volume-mute");
const volumeBar1 = document.getElementById("volume-bar");
const trackTime = document.getElementById("track-time");
const trackMax = document.getElementById("track-max");
const progressBar = document.querySelector(".progress-bar:not(#volume-bar)");
const playTitle = document.getElementById("play-title");
const playArtist = document.getElementById("play-artist");
const heartBtn1 = document.getElementById("heart-btn");

const params = new URLSearchParams(window.location.search);
const albumId = params.get("id");

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function updateProgress() {
  if (audioPlayer && !audioPlayer.paused) {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${percent}%`;
    trackTime.textContent = formatTime(audioPlayer.currentTime);

    requestAnimationFrame(updateProgress);
  }
}

function playTrack(index) {
  if (index < 0 || index >= albumTracks.length) {
    return;
  }

  currentTrackIndex = index;

  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }

  const track = albumTracks[index];

  audioPlayer = new Audio(track.preview);

  playTitle.textContent = track.title;
  playArtist.textContent = track.artist.name;
  trackMax.textContent = formatTime(track.duration);

  const volumeValue = parseFloat(volumeBar1.style.width) / 100;
  audioPlayer.volume = volumeValue || 0.25;

  audioPlayer.addEventListener("ended", () => {
    playTrack((currentTrackIndex + 1) % albumTracks.length);
  });

  audioPlayer.addEventListener("loadedmetadata", () => {
    trackMax.textContent = formatTime(audioPlayer.duration);
  });

  audioPlayer
    .play()
    .then(() => {
      isPlaying = true;
      playIcon.classList.add("d-none");
      pauseIcon.classList.remove("d-none");

      updateProgress();
    })
    .catch((error) => {
      console.error("Error playing track:", error);
    });

  highlightCurrentTrack();
}

function highlightCurrentTrack() {
  const tracks = document.querySelectorAll("#clicked-album-tracks .list-group-item");

  tracks.forEach((track, index) => {
    if (index === currentTrackIndex) {
      track.classList.add("active", "text-success");
    } else {
      track.classList.remove("active", "text-success");
    }
  });
}

function togglePlay() {
  if (!audioPlayer && albumTracks.length > 0) {
    playTrack(0);
    return;
  }

  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    playIcon.classList.remove("d-none");
    pauseIcon.classList.add("d-none");
  } else {
    audioPlayer.play();
    isPlaying = true;
    playIcon.classList.add("d-none");
    pauseIcon.classList.remove("d-none");
    updateProgress();
  }
}

function prevTrack() {
  let newIndex = currentTrackIndex - 1;
  if (newIndex < 0) {
    newIndex = albumTracks.length - 1;
  }
  playTrack(newIndex);
}

function nextTrack() {
  let newIndex = currentTrackIndex + 1;
  if (newIndex >= albumTracks.length) {
    newIndex = 0;
  }
  playTrack(newIndex);
}

function toggleMute() {
  if (audioPlayer) {
    audioPlayer.muted = !audioPlayer.muted;

    if (audioPlayer.muted) {
      volumeIcon.classList.add("d-none");
      volumeMuteIcon.classList.remove("d-none");
    } else {
      volumeIcon.classList.remove("d-none");
      volumeMuteIcon.classList.add("d-none");
    }
  }
}

function setVolume(percent) {
  if (audioPlayer) {
    audioPlayer.volume = percent / 100;
    volumeBar1.style.width = `${percent}%`;

    if (percent === 0) {
      volumeIcon.classList.add("d-none");
      volumeMuteIcon.classList.remove("d-none");
    } else {
      volumeIcon.classList.remove("d-none");
      volumeMuteIcon.classList.add("d-none");
    }
  }
}

function setupTrackListeners() {
  const tracks = document.querySelectorAll("#clicked-album-tracks .list-group-item");

  tracks.forEach((track, index) => {
    track.style.cursor = "pointer";
    track.addEventListener("click", () => {
      playTrack(index);
    });
  });
}

function setupHeartButton() {
  const heartIcon = heartBtn1.querySelector(".bi-heart");
  const heartFillIcon = heartBtn1.querySelector(".bi-heart-fill");

  heartBtn1.addEventListener("click", () => {
    heartIcon.classList.toggle("opacity-0");
    heartFillIcon.classList.toggle("opacity-0");
  });
}

function setupEventListeners() {
  playBtn1.addEventListener("click", togglePlay);

  prevBtn.addEventListener("click", prevTrack);

  nextBtn.addEventListener("click", nextTrack);

  volumeBtn1.addEventListener("click", toggleMute);

  document.querySelector(".progress").addEventListener("click", function (e) {
    if (audioPlayer) {
      const percent = e.offsetX / this.offsetWidth;
      audioPlayer.currentTime = percent * audioPlayer.duration;
      progressBar.style.width = `${percent * 100}%`;
    }
  });

  document.querySelector(".progress:not(:first-of-type)").addEventListener("click", function (e) {
    const percent = (e.offsetX / this.offsetWidth) * 100;
    setVolume(percent);
  });

  setVolume(25);

  setupHeartButton();
}

if (albumId) {
  const url = `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "3a3a3aac9amsh7f42524dfcd2095p1b26b2jsn11746df15d07",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  const fetchAlbumData = async () => {
    try {
      const response = await fetch(url, options);
      const album = await response.json();

      document.getElementById("clicked-album-title").textContent = album.title;
      document.getElementById("clicked-album-cover").src = album.cover_big;
      document.getElementById("clicked-album-artist").textContent = album.artist.name;

      albumTracks = album.tracks.data.map((track) => ({
        ...track,
        artist: album.artist,
      }));

      const trackList = document.getElementById("clicked-album-tracks");
      trackList.innerHTML = "";

      albumTracks.forEach((track, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.setAttribute("data-track-index", index);
        li.style.backgroundColor = "inherit";
        li.style.color = "white";

        const trackInfo = document.createElement("div");

        const trackTitle = document.createElement("span");
        trackTitle.innerHTML = `<span class="me-3">${index + 1}</span> ${track.title}`;
        trackInfo.appendChild(trackTitle);

        li.appendChild(trackInfo);

        const minutes = Math.floor(track.duration / 60);
        const seconds = track.duration % 60;
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

        const durationSpan = document.createElement("span");
        durationSpan.className = "badge bg-transparent text-light";
        durationSpan.textContent = formattedDuration;
        li.appendChild(durationSpan);

        trackList.appendChild(li);
      });

      const playAlbumBtn = document.getElementById("play-album-btn");
      playAlbumBtn.addEventListener("click", () => {
        playTrack(0);
      });

      setupTrackListeners();

      setupEventListeners();
    } catch (error) {
      console.error("Error fetching album data:", error);
    }
  };

  fetchAlbumData();
} else {
  console.error("No album ID provided in query string.");
}
