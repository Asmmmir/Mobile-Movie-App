// VARIABLES

const ratedContainer = document.querySelector(".top-rated");
const movieContainer = document.querySelector(".menu-movies");
const menuOption = document.querySelectorAll(".menu_option");
const upcoming = document.querySelector(".upcoming");
const popular = document.querySelector(".popular");
const toprated = document.querySelector(".toprated");
const search = document.querySelector(".search");
const watchListPage = document.querySelector(".watch-list");
let watchList = JSON.parse(localStorage.getItem("watchList")) || [];

const body = document.body;

const apiKey = "7ee97ee3a7d032fcfe7002b6b8a871e0";
const baseUrl = "https://api.themoviedb.org/3";
const imageUrl = "https://image.tmdb.org/t/p/original";

// GETTING RATED MOVIES

const getTopRatedMovies = async () => {
  const response = await fetch(`${baseUrl}/movie/top_rated?api_key=${apiKey}`);
  const { results } = await response.json();
  ratedContainer.innerHTML = results
    .map(
      ({ poster_path, id }, i) => `
      <div id=${id} class="top-rated-movie movie">
        <img src="${imageUrl}${poster_path}" alt="" width="144px">
        <h1 class="movie-number">${i + 1}</h1>
      </div>
    `
    )
    .join("");
};

// GETTING MOVIES

const getMovies = async () => {
  const response = await fetch(`${baseUrl}/movie/popular?api_key=${apiKey}`);
  const { results } = await response.json();

  movieContainer.innerHTML = results
    .map(
      ({ poster_path, id }) => `
      <div id=${id} class="menu-movies_item movie">
        <img src="${imageUrl}${poster_path}" alt="" width="100px">
      </div>
    `
    )
    .join("");

  for (let movie of movies) {
    movie.addEventListener("click", () => {
      getMovieInfo(movie.id);
    });
  }

  menuOption.forEach((option) => {
    option.addEventListener("click", () => {
      menuOption.forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
    });
  });
};

// GETTING INFORMATION

const getMovieInfo = async (id) => {
  const response = await fetch(`${baseUrl}/movie/${id}?api_key=${apiKey}`);
  const movieInfo = await response.json();
  body.innerHTML = `
  
  <div id="app-detail">
      <div class="nav">
        <a href='index.html'> <i class="fa fa-angle-left"></i></a>
        <p>Detail</p>
        <div><i id=${movieInfo.id} class="fa fa-bookmark bookmark"></i></div>
      </div>

      <div class="movie_container">
        <img
          src="https://image.tmdb.org/t/p/original/${movieInfo.backdrop_path}"
          alt=""
          width="375px"
        />
      </div>
      <div class="movie_title">
        <img
          src="https://image.tmdb.org/t/p/original/${movieInfo.poster_path}"
          alt=""
          width="95px"
        />
        <p>${movieInfo.title}</p>
      </div>
      <div class="movie_details">
        <i class="fa fa-calendar"></i>
        <p>${movieInfo.release_date.slice(0, 4)}</p>
        <p>|</p>
        <i class="fa fa-clock"></i>
        <p>${movieInfo.runtime} Minutes</p>
        <p>|</p>
        <i class="fa fa-ticket"></i>
        <p>${movieInfo.genres[0].name}</p>
      </div>

      <div class="movie_nav">
        <ul>
          <li class="movie_nav_option active">About Movie</li>
          <li class='movie_nav_option reviews'>Reviews</li>
        </ul>

        <p>
       ${movieInfo.overview}
        </p>
      </div>
    </div>
  `;
  const bookmark = document.querySelector(".bookmark");

  const movieNavOptions = document.querySelectorAll(".movie_nav_option");

  movieNavOptions.forEach((option) => {
    option.addEventListener("click", () => {
      movieNavOptions.forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
    });
  });

  bookmark.addEventListener("click", addToWatchList);

  function addToWatchList() {
    if (!watchList.includes(movieInfo.id)) {
      watchList.unshift(movieInfo.id);
      localStorage.setItem("watchList", JSON.stringify(watchList));
      bookmark.classList.add("selected");
    } else if (watchList.includes(movieInfo.id)) {
      watchList.shift();
      bookmark.classList.remove("selected");
      localStorage.setItem("watchList", JSON.stringify(watchList));
    }
  }
};

const upcomingMovie = async () => {
  const response = await fetch(`${baseUrl}/movie/upcoming?api_key=${apiKey}`);
  const { results } = await response.json();
  movieContainer.innerHTML = results
    .map(
      ({ poster_path, id }) => `
      <div id=${id} class="menu-movies_item movie">
        <img src="${imageUrl}${poster_path}" alt="" width="100px">
      </div>
    `
    )
    .join("");

  for (let movie of movies) {
    movie.addEventListener("click", () => {
      getMovieInfo(movie.id);
    });
  }
};

const topRatedMovies = async () => {
  const response = await fetch(`${baseUrl}/movie/top_rated?api_key=${apiKey}`);
  const { results } = await response.json();
  movieContainer.innerHTML = results
    .map(
      ({ poster_path, id }) => `
      <div id=${id} class="menu-movies_item movie">
        <img src="${imageUrl}${poster_path}" alt="" width="100px">
      </div>
    `
    )
    .join("");

  for (let movie of movies) {
    movie.addEventListener("click", () => {
      getMovieInfo(movie.id);
    });
  }
};

const popularMovies = async () => {
  const response = await fetch(`${baseUrl}/movie/popular?api_key=${apiKey}`);
  const { results } = await response.json();

  movieContainer.innerHTML = results
    .map(
      ({ poster_path, id }) => `
        <div id=${id} class="menu-movies_item movie">
          <img src="${imageUrl}${poster_path}" alt="" width="100px">
        </div>
      `
    )
    .join("");

  for (let movie of movies) {
    movie.addEventListener("click", () => {
      getMovieInfo(movie.id);
    });
  }
};

function switchSelected(navElement) {
  const navIcon = document.querySelectorAll(".nav-icon");
  navIcon.forEach((icon) => {
    icon.querySelector("i").classList.remove("selected");
    icon.querySelector("p").classList.remove("selected");

    const icons = navElement.querySelector("i");
    const text = navElement.querySelector("p");

    icons.classList.add("selected");
    text.classList.add("selected");
  });
}

const navElements = document.querySelectorAll(".nav-icon");
navElements.forEach((el) => {
  el.addEventListener("click", () => {
    switchSelected(el);
  });
});

function searchFocus() {
  const input = document.querySelector(".input");
  input.focus();
}

const input = document.querySelector(".input");

const searchMovies = async (e) => {
  if (e.key == "Enter") {
    const searchContainer = document.querySelector(".search-movies");
    searchContainer.classList.remove("hidden");
    const response = await fetch(`
  https://api.themoviedb.org/3/search/movie?api_key=7ee97ee3a7d032fcfe7002b6b8a871e0&query=${input.value}`);
    const { results } = await response.json();
    searchContainer.innerHTML = results
      .map(
        ({ poster_path, id }) => `
  
  <img id=${id} class='movie' src="${imageUrl}${poster_path}" alt="" width="100px"/>
  

  `
      )
      .join("");
  }

  for (let movie of movies) {
    movie.addEventListener("click", () => {
      getMovieInfo(movie.id);
    });
  }
};

const getWatchList = async () => {
  body.innerHTML = `
    <div id="watch-list_app">
    <div class="watch-list_nav">
      <a href="index.html"> <i class="fa fa-angle-left"></i></a>
      <p>Watch list</p>
    </div>

    <div class="saved-movies"></div>
  </div>

    `;

  let savedMovies = document.querySelector(".saved-movies");

  watchList.map(async (id) => {
    const response = await fetch(`${baseUrl}/movie/${id}?api_key=${apiKey}`);
    const movieInfo = await response.json();

    savedMovies.innerHTML += `
    <div id=${movieInfo.id} class="saved_item movie">
    <img src="${imageUrl}${movieInfo.poster_path}" alt="" width="95px">
    
        <div class="saved-movies_info">
          <p style='margin-bottom:14px' class='saved-movies_title'>${
            movieInfo.title
          } <i id=${movieInfo.id} class='fa fa-trash delete-btn'></i></p>
          <div class="rating info">
            <i style=${
              movieInfo.vote_average < 6 ? "color:red" : "color:yellow"
            } class="fa fa-star"></i>
            <p style=${
              movieInfo.vote_average < 6 ? "color:red" : "color:yellow"
            } >${movieInfo.vote_average.toPrecision(2)}</p>
          </div>
          <div class="genre info">
            <i class="fa fa-ticket"></i>
            <p>${movieInfo.genres[0].name}</p>
          </div>
          <div class="release info">
            <i class="fa fa-calendar"></i>
            <p>${movieInfo.release_date.slice(0, 4)}</p>
          </div>
          <div class="duration info">
            <i class="fa fa-clock"></i>
            <p>${movieInfo.runtime} Minutes</p>
          
          </div>
        </div>
      </div>
    `;

    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const movieId = button.id;
        console.log(movieId);
        removeMovieFromWatchList(movieId);
      });
    });

    const removeMovieFromWatchList = (id) => {
      watchList = watchList.filter((movieId) => movieId != id);
      localStorage.setItem("watchList", JSON.stringify(watchList));

      getWatchList();
    };
  });

  for (let movie of movies) {
    movie.addEventListener("click", () => {
      getMovieInfo(movie.id);
    });
  }
};

let movies = document.getElementsByClassName("movie");

getTopRatedMovies();
getMovies();
watchListPage.addEventListener("click", getWatchList);
upcoming.addEventListener("click", upcomingMovie);
toprated.addEventListener("click", topRatedMovies);
popular.addEventListener("click", popularMovies);
input.addEventListener("keypress", searchMovies);
search.addEventListener("click", searchFocus);
