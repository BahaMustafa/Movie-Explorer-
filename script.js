// Listen for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {

    // Select home button and add click event listener
    const homeButton = document.querySelector('#home-button');
    homeButton.addEventListener('click', goHome);

    // Select search form and add submit event listener
    const searchForm = document.querySelector('#search-form');
    searchForm.addEventListener('submit', performSearch);

    // Select the favorites and watchlist sections
    const favoritesSection = document.querySelector('#favorites-section');
    const watchlistSection = document.querySelector('#watchlist-section');

    // Fetch movies and display them once they're loaded
    getMovies().then(displayMovies);
    
    // Display the user's favorites and watchlist
    displayFavorites();
    displayWatchlist();

    // Listen for changes in favorites and watchlist sections
    favoritesSection.addEventListener('change', handleFavoritesChange);
    watchlistSection.addEventListener('change', handleWatchlistChange);
});

// Function to navigate to the home page
function goHome() {
    const searchInput = document.querySelector('#search-input');
    searchInput.value = '';  // Clear the search input
    getMovies().then(displayMovies);  // Fetch and display movies
}

// Perform a movie search based on the user's input
function performSearch(event) {
    event.preventDefault(); // Prevent form submission
    
    const searchTerm = document.querySelector('#search-input').value;
    
    searchMovies(searchTerm);
}

// Search movies using the provided search term
function searchMovies(searchTerm) {
    const url = `https://us-central1-uplifted-mantra-385806.cloudfunctions.net/function-1?searchTerm=${searchTerm}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const movieList = document.querySelector("#movie-list");
            movieList.innerHTML = "";

            if (data.results.length === 0) {
                movieList.innerHTML = "<p>No results found.</p>";
                return;
            }

            data.results.forEach(movie => {
                
                addMovieToPage(movie);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Add a movie to the page
function addMovieToPage(movie) {
    const movieList = document.querySelector("#movie-list");

    // Create HTML elements for the movie
    const movieItem = document.createElement("li");
    const movieTitle = document.createElement("h2");
    const movieImage = document.createElement("img");
    const favoriteButton = document.createElement("button");
    const watchlistButton = document.createElement("button");

    // Set content and attributes for the movie elements
    movieTitle.textContent = movie.title;
    movieImage.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
    favoriteButton.textContent = "Add to Favorites";
    watchlistButton.textContent = "Add to Watchlist";

    favoriteButton.classList.add("button", "favorite");
    watchlistButton.classList.add("button", "watchlist");

    // Add event listeners to the favorite and watchlist buttons
    favoriteButton.addEventListener("click", () => addToFavorites(movie));
    watchlistButton.addEventListener("click", () => addToWatchlist(movie));

    // Append the movie elements to the movie item
    movieItem.appendChild(movieTitle);
    movieItem.appendChild(movieImage);
    movieItem.appendChild(favoriteButton);
    movieItem.appendChild(watchlistButton);

    // If a trailer URL is available, add a trailer link
    if (movie.trailer) {
        const trailerLink = document.createElement("a");
        trailerLink.href = movie.trailer;
        trailerLink.textContent = "Watch Trailer";
        trailerLink.classList.add("button", "trailer");  
        movieItem.appendChild(trailerLink);
    }

    // Add the movie item to the movie list
    movieList.appendChild(movieItem);
}

// Fetch the list of movies from the API
function getMovies() {
    const url = 'https://us-central1-uplifted-mantra-385806.cloudfunctions.net/function-1';

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

            // Add properties to each movie indicating if it's in the favorites or watchlist
            return data.results.map(movie => {
                movie.isFavorite = favorites.some(favorite => favorite.id === movie.id);
                movie.isInWatchlist = watchlist.some(item => item.id === movie.id);
                return movie;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Display a list of movies on the page
function displayMovies(movies) {
    const movieList = document.querySelector("#movie-list");
    movieList.innerHTML = "";

    movies.forEach(movie => {
        addMovieToPage(movie);
    });
}

// Display the user's favorite movies
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritesSection = document.querySelector("#favorites-section");
    favoritesSection.innerHTML = "";

    if (favorites.length === 0) {
        favoritesSection.innerHTML = "<p>No favorite movies found.</p>";
        return;
    }

    const favoritesList = document.createElement("ul");
    favoritesList.classList.add("movie-list", "favorites-list");

    favorites.forEach(movie => {
        const movieItem = createMovieItem(movie, "favorites");
        favoritesList.appendChild(movieItem);
    });

    favoritesSection.appendChild(favoritesList);
}

// Display the user's watchlist
function displayWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const watchlistSection = document.querySelector("#watchlist-section");
    watchlistSection.innerHTML = "";

    if (watchlist.length === 0) {
        watchlistSection.innerHTML = "<p>No movies in watchlist.</p>";
        return;
    }

    const watchlistList = document.createElement("ul");
    watchlistList.classList.add("movie-list", "watchlist-list");

    watchlist.forEach(movie => {
        const movieItem = createMovieItem(movie, "watchlist");
        watchlistList.appendChild(movieItem);
    });

    watchlistSection.appendChild(watchlistList);
}

// Create a movie list item
function createMovieItem(movie, listType) {
    const movieItem = document.createElement("li");
    const movieTitle = document.createElement("h2");
    const movieImage = document.createElement("img");

    movieTitle.textContent = movie.title;
    movieImage.src = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("button", "remove");
    
    if (listType === "favorites") {
        removeButton.addEventListener("click", () => removeFromFavorites(movie));
    } else if (listType === "watchlist") {
        removeButton.addEventListener("click", () => removeFromWatchlist(movie));
    }

    movieItem.appendChild(movieTitle);
    movieItem.appendChild(movieImage);
    movieItem.appendChild(removeButton);

    return movieItem;
}

// Add a movie to the favorites list
function addToFavorites(movie) {
    console.log("addToWatchlist called", movie);
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

// Remove a movie from the favorites list
function removeFromFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(favorite => favorite.id !== movie.id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

// Add a movie to the watchlist
function addToWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    displayWatchlist();
}

// Remove a movie from the watchlist
function removeFromWatchlist(movie) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist = watchlist.filter(item => item.id !== movie.id);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    displayWatchlist();
}

// Event handler for scrolling
window.onscroll = function() {
    showBackToTopButton();
};

// Show or hide the "back to top" button based on scroll position
function showBackToTopButton() {
    var button = document.getElementById("back-to-top-btn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

// Scroll the page back to the top
function scrollToTop() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
}
