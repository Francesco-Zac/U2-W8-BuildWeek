const pause = document.querySelector(".bi-pause-circle-fill");
const play = document.querySelector(".bi-play-circle-fill");
const playBtn = document.getElementById("play-btn");
const heartBtn = document.getElementById("heart-btn");
const playTitle = document.getElementById("play-title");
const playArttist = document.getElementById("play-artist");
const playImg = document.getElementById("play-img");
const heartBtnFull = document.getElementById("heart-btn-full");
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
const notiBage = document.getElementById("notify-bage");
const frends = document.getElementById("frend");
const logoClose = document.getElementById("logo-closening");
const logoOpen = document.getElementById("logo-opener");
const logoClose2 = document.getElementById("logo-closening2");
const logoOpen2 = document.getElementById("logo-opener2");
const btnSide = document.getElementById("logo-close-btn");
const btnSide2 = document.getElementById("logo-close-btn2");
const leftClose = document.getElementById("left-close");
const leftImgList = document.getElementById("left-img-list");

const addImgLeft = function () {
  const library = document.querySelectorAll(".library-card");
  library.forEach((card) => {
    const libTitle = card.querySelector(".lib-title").innerText;
    if (libTitle === playTitle.innerText) {
      card.remove();
      localStorage.setItem("leftCol", playlist.innerHTML);
    }
  });
};

const favoriteControl = function () {
  const library = document.querySelectorAll(".library-card");
  if (library.length > 0) {
    library.forEach((card) => {
      const libTitle = card.querySelector(".lib-title").innerText;
      if (libTitle === playTitle.innerText) {
        heartBtn.classList.add("d-none");
        heartBtnFull.classList.remove("d-none");
      } else {
        heartBtnFull.classList.add("d-none");
        heartBtn.classList.remove("d-none");
      }
    });
  } else {
    heartBtnFull.classList.add("d-none");
    heartBtn.classList.remove("d-none");
  }
};

btnSide.onmouseover = function () {
  if (window.innerWidth > 992) {
    logoClose.classList.add("d-none");
    logoOpen.classList.remove("d-none");
  }
};
btnSide.onmouseout = function () {
  if (window.innerWidth > 992) {
    logoClose.classList.remove("d-none");
    logoOpen.classList.add("d-none");
  }
};
btnSide2.onmouseover = function () {
  logoClose2.classList.add("d-none");
  logoOpen2.classList.remove("d-none");
};
btnSide2.onmouseout = function () {
  logoClose2.classList.remove("d-none");
  logoOpen2.classList.add("d-none");
};

heartBtn.onclick = function () {
  heartBtn.classList.add("d-none");
  heartBtnFull.classList.remove("d-none");
  const img = playImg.src;
  const title = playTitle.innerText;
  const album = playArttist.innerText;
  const playData = {
    album: { cover_small: img, titele: album },
    title: title,
  };
  cardGen(true, playData);
  const sideCloseImg = document.createElement("img");
  sideCloseImg.classList.add("side-img", "rounded-circle");
  sideCloseImg.src = playImg.src;
  sideCloseImg.style.width = "48px";
  leftImgList.appendChild(sideCloseImg);

  localStorage.setItem("leftCol", playlist.innerHTML);
  localStorage.setItem("leftCloseCol", leftImgList.innerHTML);
};
heartBtnFull.onclick = function () {
  heartBtnFull.classList.add("d-none");
  heartBtn.classList.remove("d-none");
  const library = document.querySelectorAll(".library-card");
  const sideImgClose = document.querySelectorAll(".side-img");
  library.forEach((card) => {
    const libTitle = card.querySelector(".lib-title").innerText;
    if (libTitle === playTitle.innerText) {
      card.remove();
      localStorage.setItem("leftCol", playlist.innerHTML);
    }
  });
  sideImgClose.forEach((img) => {
    if (playImg.src === img.src) {
      img.remove();
      localStorage.setItem("leftCloseCol", leftImgList.innerHTML);
    }
  });
};

leftOpen.onmouseover = function () {
  libCloser.classList.remove("d-none");
  libCloser.classList.add("slide-right");
};
leftOpen.onmouseout = function () {
  libCloser.classList.add("d-none");
  libCloser.classList.remove("slide-right");
};

notify.onclick = function () {
  notiBage.classList.add("d-none");
  if (window.innerWidth > 992) {
    right.classList.toggle("d-none");
    if (leftOpen.classList.contains("d-lg-block")) {
      center.classList.toggle("col-lg-9");
    } else {
      center.classList.toggle("col-lg-12");
    }
  } else {
    if (!center.classList.contains("d-none") && !right.classList.contains("d-none")) {
      center.classList.add("d-none");
    } else {
      center.classList.toggle("d-none");
    }
  }
};
libCloser.onclick = function () {
  leftOpen.classList.remove("d-lg-block");
  leftClose.classList.remove("d-lg-none");
  if (right.classList.contains("d-none")) {
    center.classList.toggle("col-lg-12");
  } else {
    center.classList.toggle("col-lg-9");
  }
};

btnSide.onclick = function () {
  leftClose.classList.add("d-lg-none");
  leftOpen.classList.add("d-lg-block");
  if (right.classList.contains("d-none")) {
    center.classList.toggle("col-lg-12");
  } else {
    center.classList.toggle("col-lg-9");
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
  cardTrack.classList.add("lib-title");
  cardTrack.style.fontSize = "14px";
  cardAlbum.style.fontSize = "12px";

  cardImg.src = data.album.cover_small;
  cardTrack.innerText = data.title;
  cardAlbum.innerText = data.album.title;

  if (v) {
    const cardPlay = document.createElement("div");

    cardPlay.classList.add("card-play", "d-flex", "justify-content-center", "position-absolute");
    cardPlay.style.width = "48px";
    cardPlay.style.height = "48px";
    cardPlay.style.backgroundColor = " #42424282";
    cardPlay.innerHTML = `   <svg
                          data-encore-id="icon"
                          role="img"
                          aria-hidden="true"
                          class="e-9890-icon e-9890-baseline"
                          viewBox="0 0 24 24"
                          style="width: 24px; fill: white"
                        >
                          <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                        </svg>`;

    card.classList.add("library-card");
    imgDiv.classList.add("position-relative");
    imgDiv.appendChild(cardPlay);
    imgDiv.appendChild(cardImg);
    cardText.appendChild(cardTrack);
    cardText.appendChild(cardAlbum);
    cardDiv.appendChild(imgDiv);
    cardDiv.appendChild(cardText);
    card.appendChild(cardDiv);
    playlist.appendChild(card);
  } else {
    card.classList.add("frend-card");
    cardDiv.classList.remove("align-items-center");

    const cardTime = document.createElement("div");
    cardTime.classList.add("ms-auto", "flex-shrink-0");
    const timeText = document.createElement("span");
    const cardName = document.createElement("span");
    cardName.style.fontSize = "14px";
    cardTrack.style.fontSize = "12px";
    timeText.style.fontSize = "10px";
    timeText.classList.add("time");

    cardImg.src = data.album.cover_small;
    cardName.innerText = "sbabulli";
    timeText.innerText = "now";
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
    frends.insertBefore(card, frends.children[0]);
  }
};

// const messageGen = function () {
//   const friendsArry = [];
//   const randFriendAlbum = ["eminem", "adele", "drake", "coldplay"];

//   for (let i = 0; i < 3; i++) {
//     const randNum = Math.floor(Math.random() * randFriendAlbum.length);
//     console.log(randFriendAlbum[randNum]);

//   }
// };

fetch("https://deezerdevs-deezer.p.rapidapi.com/search?q=drake", {
  headers: {
    "x-rapidapi-key": "d5ce525b28msh47691e1e7c71304p1ee8bajsnf3418b6f6e9b",
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
})
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    }
  })
  .then((data) => {
    const allData = data.data;
    console.log(allData);
    if (frends.innerHTML === "") {
      cardGen(false, allData[2]);
    }

    let randTime = Math.floor(Math.random() * 60000) + 20000;
    console.log(randTime);

    setInterval(() => {
      const randTime2 = Math.floor(Math.random() * randTime);
      console.log("rand2", randTime2);
      setTimeout(() => {
        const randNum = Math.floor(Math.random() * allData.length);
        cardGen(false, allData[randNum]);
        localStorage.setItem("rightCol", frends.innerHTML);
        if (right.classList.contains("d-none")) {
          notiBage.classList.remove("d-none");
        }
      }, randTime2);
      randTime = Math.floor(Math.random() * 30000) + 5000;
    }, randTime);
    setInterval(() => {
      const allTime = document.querySelectorAll(".time");
      randTime = Math.floor(Math.random() * 30000) + 5000;
      console.log(randTime);
      allTime.forEach((time) => {
        if (time.innerText === "now") {
          time.innerText = "1 min";
        } else {
          time.innerText = `${parseInt(time.innerText) + 1} min`;
        }
      });
    }, 60000);
  })
  .catch((error) => console.log(error));

window.onload = function () {
  const frendHtml = localStorage.getItem("rightCol");
  const playlistCloseHtml = localStorage.getItem("leftCloseCol");
  const playlistHtml = localStorage.getItem("leftCol");
  frends.innerHTML = frendHtml;
  playlist.innerHTML = playlistHtml;
  leftImgList.innerHTML = playlistCloseHtml;
  favoriteControl();
};
