async function fetchGenres() {
  const url = "https://deezerdevs-deezer.p.rapidapi.com/genre";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "dad1558565msh18f5f454539444fp1e8fbajsn8fe0405f9799",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.data) {
      displayGenres(data.data);
    } else {
      console.error("Dati API non validi:", data);
    }
  } catch (error) {
    console.error("Errore nel recupero dei dati:", error);
  }
}

function displayGenres(genres) {
  const container = document.getElementById("genres-container");
  container.innerHTML = "";

  genres.forEach((genre) => {
    const card = document.createElement("div");
    card.className = "card m-2";
    card.style.width = "200px";

    card.innerHTML = `
          <img src="${genre.picture}" class="card-img-top" alt="${genre.name}">
          <div class="card-body">
            <h5 class="card-title">${genre.name}</h5>
          </div>
        `;

    container.appendChild(card);
  });
}

fetchGenres();
