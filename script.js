let secrets;
fetch('./secrets.json')
  .then(response => response.json())
  .then(data => secrets = data);

  document.addEventListener('DOMContentLoaded', async () => {
    const searchButton = document.querySelector('#search-button');
    searchButton.addEventListener('click', performSearch);

    await fetch('./secrets.json')
        .then(response => response.json())
        .then(data => secrets = data);

    getMovies().then(displayMovies);
    displayFavorites();
    displayWatchlist();
});

function performSearch() {
    const searchTerm = document.querySelector('#search-input').value;
    searchMovies(searchTerm);
}

function searchMovies(searchTerm) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${secrets.API_KEY}&query=${searchTerm}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(movie => {
                addMovieToPage(movie);
            });
        })
        .catch(error => console.error('Error:', error));
}
function addMovieToPage(movie) {
    const movieList = document.querySelector("#movie-list");

    const movieItem = document.createElement("li");
    const movieTitle = document.createElement("h2");
    const movieImage = document.createElement("img");
    const favoriteButton = document.createElement("button");
    const watchlistButton = document.createElement("button");

    movieTitle.textContent = movie.title;
    movieImage.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
    favoriteButton.textContent = "Add to Favorites";
    watchlistButton.textContent = "Add to Watchlist";

    favoriteButton.classList.add("button", "favorite");
    watchlistButton.classList.add("button", "watchlist");

    favoriteButton.addEventListener("click", () => addToFavorites(movie));
    watchlistButton.addEventListener("click", () => addToWatchlist(movie));

    movieItem.appendChild(movieTitle);
    movieItem.appendChild(movieImage);
    movieItem.appendChild(favoriteButton);
    movieItem.appendChild(watchlistButton);
    movieList.appendChild(movieItem);
}

function getMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${secrets.API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);  
            const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

            return data.results.map(movie => {
                movie.isFavorite = favorites.some(favorite => favorite.id === movie.id);
                movie.isInWatchlist = watchlist.some(item => item.id === movie.id);
                return movie;
            });
        })
        .catch(error => console.error('Error:', error));
}

function displayMovies(movies) {
    const movieList = document.querySelector("#movie-list");
    movieList.innerHTML = "";

    movies.forEach(movie => {
        addMovieToPage(movie);
    });
}
