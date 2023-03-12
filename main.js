

const ratedContainer = document.querySelector(".top-rated");
const movieContainer = document.querySelector(".menu-movies");

const apiKey = "7ee97ee3a7d032fcfe7002b6b8a871e0";
const baseUrl = "https://api.themoviedb.org/3";
const imageUrl = "https://image.tmdb.org/t/p/original";

const getTopRatedMovies = async () => {
  const response = await fetch(`${baseUrl}/movie/top_rated?api_key=${apiKey}`);
  const { results } = await response.json();
  let i = 1;
  ratedContainer.innerHTML = results
    .map(({ poster_path }) => `
      <div class="top-rated-movie">
        <img src="${imageUrl}${poster_path}" alt="" width="144px">
        <h1 class="movie-number">${i++}</h1>
      </div>
    `)
    .join("");
};

const getMovies = async () => {
  const response = await fetch(`${baseUrl}/trending/all/week?api_key=${apiKey}`);
  const { results } = await response.json();
  movieContainer.innerHTML = results
    .map(({ poster_path }) => `
      <div class="menu-movies_item">
        <img src="${imageUrl}${poster_path}" alt="" width="100%" height="145px">
      </div>
    `)
    .join("");
};

getTopRatedMovies();
getMovies();