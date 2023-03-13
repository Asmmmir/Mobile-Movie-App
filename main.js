// VARIABLES

const ratedContainer = document.querySelector(".top-rated");
const movieContainer = document.querySelector(".menu-movies");
const menuOption = document.querySelectorAll(".menu_option");
const upcoming = document.querySelector(".upcoming");
const popular = document.querySelector(".popular");
const toprated = document.querySelector(".toprated");
const navIcon = document.querySelectorAll('.nav-icon')

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

let movies = document.getElementsByClassName("movie");

// GETTING INFORMATION

const getMovieInfo = async (id) => {
  const response = await fetch(`${baseUrl}/movie/${id}?api_key=${apiKey}`);
  const movieInfo = await response.json();
  body.innerHTML = `
  
  <div id="app">
      <div class="nav">
        <a href="../index.html"><i class="fa fa-angle-left"></i></a>
        <p>Detail</p>
        <div><i class="fa fa-bookmark"></i></div>
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

  const movieNavOptions = document.querySelectorAll(".movie_nav_option");

  movieNavOptions.forEach((option) => {
    option.addEventListener("click", () => {
      movieNavOptions.forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
    });
  });
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




getTopRatedMovies();
getMovies();
upcoming.addEventListener("click", upcomingMovie);
toprated.addEventListener("click", topRatedMovies);
popular.addEventListener("click", popularMovies);
