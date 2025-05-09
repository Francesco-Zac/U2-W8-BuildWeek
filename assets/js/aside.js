// chiave usata in localStorage
const LIKED_KEY = "likedTracks";

// restituisce un array (vuoto se non esiste)
function getLikedTracks() {
  const raw = localStorage.getItem(LIKED_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// salva l'array in localStorage
function setLikedTracks(arr) {
  localStorage.setItem(LIKED_KEY, JSON.stringify(arr));
}

const pause = document.querySelector(".bi-pause-circle-fill");
const play = document.querySelector(".bi-play-circle-fill");
const playBtn = document.getElementById("play-btn");
const heartBtn = document.getElementById("heart-btn");
const heart = document.querySelector(".bi-heart-fill");
const svg = document.querySelectorAll(".navbar svg");
const volumeIcone = document.getElementById("volume-icon");
const volumeMute = document.getElementById("volume-mute");
const volumeBtn = document.getElementById("volume-btn");
const volumeBar = document.getElementById("volume-bar");
const srcDiv = document.getElementById("src-library");
const srcBtn = document.getElementById("src-library-btn");
const srcInput = document.getElementById("src-input");
const srcNav = document.getElementById("search-nav");
const libCloser = document.getElementById("library-closer");
const leftOpen = document.getElementById("left-open");
const right = document.getElementById("right");
const center = document.getElementById("center");
const notify = document.getElementById("notify");

heartBtn.onclick = function () {
  heart.classList.toggle("opacity-0");
};

leftOpen.onmouseover = function () {
  libCloser.classList.remove("d-none");
};
leftOpen.onmouseout = function () {
  libCloser.classList.add("d-none");
};

notify.onclick = function () {
  right.classList.toggle("d-none");
  if (leftOpen.classList.contains("d-none")) {
    center.classList.toggle("col-12");
  } else {
    center.classList.toggle("col-9");
  }
};
libCloser.onclick = function () {
  leftOpen.classList.toggle("d-none");
  if (right.classList.contains("d-none")) {
    center.classList.toggle("col-12");
  } else {
    center.classList.toggle("col-9");
  }
};
srcBtn.onclick = function () {
  srcDiv.classList.toggle("bg-new");
};
srcInput.onfocus = function () {
  srcNav.classList.add("search-nav-focus");
};
srcInput.onblur = function () {
  srcNav.classList.remove("search-nav-focus");
};

playBtn.onclick = function () {
  play.classList.toggle("d-none");
  pause.classList.toggle("d-none");
};
volumeBtn.onclick = function () {
  volumeIcone.classList.toggle("d-none");
  volumeMute.classList.toggle("d-none");
  volumeBar.classList.toggle("d-none");
};

svg.forEach((s) => {
  s.onclick = function () {
    if (!s.classList.contains("skip")) {
      s.classList.toggle("svgFill");
    }
  };
});

// creazione frend card
const cardGen = function (v, data) {
  const card = document.createElement("il");
  const cardDiv = document.createElement("div");
  const imgDiv = document.createElement("div");
  const cardImg = document.createElement("img");
  const cardText = document.createElement("div");
  const cardTrack = document.createElement("span");
  const cardAlbum = document.createElement("span");

  card.classList.add("rounded-2", "p-2");
  cardDiv.classList.add("d-flex", "align-items-center", "gap-1");
  cardImg.classList.add("rounded-circle");
  cardImg.style.width = "48px";
  cardText.classList.add("d-flex", "flex-column", "ms-2");
  cardTrack.style.fontSize = "14px";
  cardAlbum.style.fontSize = "12px";

  cardImg.src = data.album.cover_small;
  cardTrack.innerText = data.title;
  cardAlbum.innerText = data.album.title;

  if (v) {
    const playlist = document.getElementById("playlist");

    card.classList.add("library-card");
    imgDiv.appendChild(cardImg);
    cardText.appendChild(cardTrack);
    cardText.appendChild(cardAlbum);
    cardDiv.appendChild(imgDiv);
    cardDiv.appendChild(cardText);
    card.appendChild(cardDiv);
    playlist.appendChild(card);
  } else {
    const frends = document.getElementById("frend");
    card.classList.add("frend-card");
    cardDiv.classList.remove("align-items-center");

    const cardTime = document.createElement("div");
    cardTime.classList.add("ms-auto", "flex-shrink-0");
    const timeText = document.createElement("span");
    const cardName = document.createElement("span");
    cardName.style.fontSize = "14px";
    cardTrack.style.fontSize = "12px";
    timeText.style.fontSize = "10px";

    cardImg.src = data.album.cover_small;
    cardName.innerText = "sbabulli";
    timeText.innerText = "8 min";
    cardTrack.innerHTML = `${data.title}<i class="bi bi-dot"></i>${data.artist.name} `;
    cardAlbum.innerHTML = `<i class="bi bi-disc"></i> ${data.album.title}`;

    imgDiv.appendChild(cardImg);
    cardTime.appendChild(timeText);
    cardText.appendChild(cardName);
    cardText.appendChild(cardTrack);
    cardText.appendChild(cardAlbum);
    cardDiv.appendChild(imgDiv);
    cardDiv.appendChild(cardText);
    cardDiv.appendChild(cardTime);
    card.appendChild(cardDiv);
    frends.appendChild(card);
  }
};
window.addEventListener("DOMContentLoaded", () => {
  const saved = getLikedTracks();
  saved.forEach((data) => {
    // ricrea la card in libreria per ogni brano salvato
    cardGen(true, data);
  });
});

const playTitleEl = document.getElementById("play-title");
const playArtistEl = document.getElementById("play-artist");
const playerImgEl = document.getElementById("navbar-player-img");

heartBtn.onclick = function (e) {
  heart.classList.toggle("opacity-0");

  const playTitle = document.getElementById("play-title").textContent;
  const playArtist = document.getElementById("play-artist").textContent;
  const cover = document.getElementById("navbar-player-img").src;

  const trackData = {
    album: { cover_small: cover, title: playArtist },
    title: playTitle,
  };

  let liked = getLikedTracks();

  if (!heart.classList.contains("opacity-0")) {
    if (!liked.some((t) => t.title === trackData.title && t.album.cover_small === cover)) {
      liked.push(trackData);
      setLikedTracks(liked);
      cardGen(true, trackData);
    }
  } else {
    liked = liked.filter((t) => !(t.title === trackData.title && t.album.cover_small === cover));
    setLikedTracks(liked);

    const playlist = document.getElementById("playlist");
    Array.from(playlist.children).forEach((li) => {
      const img = li.querySelector("img");
      const txt = li.querySelector("span").innerText;
      if (img && img.src === cover && txt === playTitle) {
        playlist.removeChild(li);
      }
    });
  }
};

const followBtn = document.querySelector(".follow-button");
if (followBtn) {
  followBtn.addEventListener("click", () => {
    const artistName = document.getElementById("artist-name").textContent;
    const bannerUrl = document.getElementById("banner").style.backgroundImage.match(/url\("?(.*?)"?\)/)[1];

    const artistData = {
      album: { cover_small: bannerUrl, title: artistName },
      title: artistName,
    };

    const LIKED_ARTISTS_KEY = "likedArtists";
    const getLikedArtists = () => {
      const raw = localStorage.getItem(LIKED_ARTISTS_KEY);
      return raw ? JSON.parse(raw) : [];
    };
    const setLikedArtists = (arr) => localStorage.setItem(LIKED_ARTISTS_KEY, JSON.stringify(arr));

    let likedArtists = getLikedArtists();
    if (!likedArtists.some((a) => a.title === artistName)) {
      likedArtists.push(artistData);
      setLikedArtists(likedArtists);
      cardGen(true, artistData);
      followBtn.textContent = "✓ Seguito";
      followBtn.classList.add("btn-success");
    } else {
      likedArtists = likedArtists.filter((a) => a.title !== artistName);
      setLikedArtists(likedArtists);

      const playlist = document.getElementById("playlist");
      Array.from(playlist.children).forEach((li) => {
        const txt = li.querySelector("span").innerText;
        if (txt === artistName) playlist.removeChild(li);
      });
      followBtn.textContent = "Segui";
      followBtn.classList.remove("btn-success");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const likedArtistsRaw = localStorage.getItem("likedArtists");
  if (likedArtistsRaw) {
    JSON.parse(likedArtistsRaw).forEach((artistData) => {
      cardGen(true, artistData);
    });
  }
});
