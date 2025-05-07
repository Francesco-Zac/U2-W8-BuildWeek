const rowFrend = document.getElementById("frend-card");
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
const playlist = document.getElementById("palylist");

heartBtn.onclick = function () {
  heart.classList.toggle("opacity-0");
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
const cardGen = function (track, album) {
  const card = document.createElement("il");
  const cardDiv = document.createElement("div");
  const imgDiv = document.createElement("div");
  const cardImg = document.createElement("img");
  const cardText = document.createElement("div");
  //  const  cardName = document.createElement("span");
  const cardTrack = document.createElement("span");
  const cardAlbum = document.createElement("span");
  //   const cardTime = document.createElement("div");
  //   const timeText = document.createElement("p");

  card.classList.add("rounded-2", "p-2");
  cardDiv.classList.add("d-flex", "align-items-center", "gap-1");
  cardImg.classList.add("rounded-circle");
  cardImg.style.width = "48px";
  cardText.classList.add("d-flex", "flex-column", "ms-2");
  cardTrack.style.fontSize = "14px";
  cardAlbum.style.fontSize = "12px";

  cardImg.src = "./assets/img/image-2.jpg";
  cardTrack.innerText = track;
  cardAlbum.innerText = album;

  const playlist = document.getElementById("palylist");

  card.classList.add("library-card");
  imgDiv.appendChild(cardImg);
  cardText.appendChild(cardTrack);
  cardText.appendChild(cardAlbum);
  cardDiv.appendChild(imgDiv);
  cardDiv.appendChild(cardText);
  card.appendChild(cardDiv);
  playlist.appendChild(card);
};

cardGen("canzone", "nuova");
