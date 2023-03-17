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
const paginationContainer = document.querySelector('.pagination')
const body = document.body;

const apiKey = "7ee97ee3a7d032fcfe7002b6b8a871e0";
const baseUrl = "https://api.themoviedb.org/3";
const imageUrl = "https://image.tmdb.org/t/p/original";
let activeType = 'popular';
let currentPage = 1;

// PAGINATION CREATOR 

for(let i = 1; i<=500;i++){
  paginationContainer.innerHTML += `
  <li class='page'>${i}</li>
  
  `
}

let movies = document.getElementsByClassName("movie");

   async function renderMoviesByType (type) {
      let response = await fetch(`${baseUrl}/movie/${type}?api_key=${apiKey}&page=${currentPage}`);
      let { results } = await response.json();
     
      if (document.querySelector('.menu_option.popular').classList.contains('active')) {
        activeType = 'popular';
      } else if (document.querySelector('.menu_option.toprated').classList.contains('active')) {
        activeType = 'top_rated';
      } else if (document.querySelector('.menu_option.upcoming').classList.contains('active')) {
        activeType = 'upcoming';
      }

      

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



}






// GETTING MOVIES

const getMovies = async () => {
  const response = await fetch(`${baseUrl}/movie/popular?api_key=${apiKey}&page=1`);
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
      console.log(movie);
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
          <li class="movie_nav_option about-movie active">About Movie</li>
          <li class='movie_nav_option reviews'>Reviews</li>
        </ul>

        <div class='detail-container'>
       ${movieInfo.overview}
        </div>
      </div>
    </div>
  `;

  const review = document.querySelector(".reviews");
  const aboutMovie = document.querySelector(".about-movie");

  aboutMovie.addEventListener("click", async () => {
    const response = await fetch(`${baseUrl}/movie/${id}?api_key=${apiKey}`);
    const movieInfo = await response.json();
    const detailContainer = document.querySelector(".detail-container");

    detailContainer.innerHTML = "";
    detailContainer.innerHTML += `
    <p>${movieInfo.overview}</p>
    </div>
    `;
  });

  review.addEventListener("click", async () => {
    const response = await fetch(
      `${baseUrl}/movie/${id}/reviews?api_key=${apiKey}`
    );
    const { results,total_pages } = await response.json();
    const detailContainer = document.querySelector(".detail-container");

    results.map(({ author, content}) => {
      detailContainer.innerHTML = "";
      detailContainer.innerHTML += `
    <div class='review-container'>
    <div class='review_person'>
    <i class='fa fa-user'></i>
    <p style='font-weight:bold;color:cyan'>${author}</p>
    </div>
    <p>${total_pages == 0?'No reviews yet':content}</p>
    </div>
    `;
    });
  });

  const bookmark = document.querySelector(".bookmark");

  if (watchList.includes(movieInfo.id)) {
    let selectedMovie = document.getElementById(`${movieInfo.id}`);
    selectedMovie.classList.add("selected");
  }

  const movieNavOptions = document.querySelectorAll(".movie_nav_option");

  movieNavOptions.forEach((option) => {
    option.addEventListener("click", () => {
      movieNavOptions.forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
    });
  });

  bookmark.addEventListener("click", addToWatchList);

  function addToWatchList() {
    const removeBookmark = (id) => {
      watchList = watchList.filter((movieId) => movieId != id);
      localStorage.setItem("watchList", JSON.stringify(watchList));
    };

    if (!watchList.includes(movieInfo.id)) {
      watchList.unshift(movieInfo.id);
      localStorage.setItem("watchList", JSON.stringify(watchList));
      bookmark.classList.add("selected");
    } else if (watchList.includes(movieInfo.id)) {
      removeBookmark(movieInfo.id);
      bookmark.classList.remove("selected");
      localStorage.setItem("watchList", JSON.stringify(watchList));
    }
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


// SEARCH 

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




// WATCH LIST 

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



// CHANGE PAGE 

const pages = document.querySelectorAll('.page')


pages.forEach(page => {
  page.addEventListener('click', () => {
    pages.forEach(item => item.classList.remove('selected-page'))
    page.classList.add('selected-page')
  })
 })

 const changePage = async (e,type = activeType) => {
  currentPage = e.target.innerText
  const response = await fetch(`${baseUrl}/movie/${type}?api_key=${apiKey}&page=${currentPage}`);
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
}








getTopRatedMovies();
getMovies();
watchListPage.addEventListener("click", getWatchList);
upcoming.addEventListener("click", () => renderMoviesByType('upcoming'));
toprated.addEventListener("click", () => renderMoviesByType('top_rated'));
popular.addEventListener("click", () => renderMoviesByType('popular'));
input.addEventListener("keypress", searchMovies);
search.addEventListener("click", searchFocus);
pages.forEach(page => page.addEventListener('click', changePage))