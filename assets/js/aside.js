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
