menuBtn = document.getElementById("menu-btn");
menuDrop = document.getElementById("menu-dropdown");
rowFrend = document.getElementById("frend-card");
pause = document.querySelector(".bi-pause-circle-fill");
play = document.querySelector(".bi-play-circle-fill");
playBtn = document.getElementById("play-btn");
heartBtn = document.getElementById("heart-btn");
heart = document.querySelector(".bi-heart-fill");
svg = document.querySelectorAll(".navbar svg");
volumeIcone = document.getElementById("volume-icon");
volumeMute = document.getElementById("volume-mute");
volumeBtn = document.getElementById("volume-btn");
volumeBar = document.getElementById("volume-bar");

heartBtn.onclick = function () {
  heart.classList.toggle("opacity-0");
};
menuBtn.onclick = function () {
  menuDrop.classList.toggle("d-none");
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
frendCardGen = function () {
  frendCard = document.createElement("div");
  imgCol = document.createElement("div");
  frendImg = document.createElement("img");
  frendText = document.createElement("div");
  frendName = document.createElement("h5");
  frendTrack = document.createElement("p");
  frendAlbum = document.createElement("p");
  frendTime = document.createElement("div");
  timeText = document.createElement("p");

  frendCard.classList.add("row", "text-secondary");
  frendImg.classList.add("rounded-circle");
  frendText.classList.add("col-8");
  imgCol.classList.add("col-2");
  frendTime.classList.add("col-2");
  frendImg.src = "./assets/img/image-2.jpg";
  frendImg.style.width = "10px";
  frendName.innerText = "name";
  frendTrack.innerText = "track";
  frendAlbum.innerText = "album";
  timeText.innerText = "time";

  frendText.appendChild(frendName);
  frendText.appendChild(frendTrack);
  frendText.appendChild(frendAlbum);
  frendTime.appendChild(timeText);
  imgCol.appendChild(frendImg);
  frendCard.appendChild(imgCol);
  frendCard.appendChild(frendText);
  frendCard.appendChild(frendTime);
  rowFrend.appendChild(frendCard);
};
