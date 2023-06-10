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
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(movie => {
                addMovieToPage(movie);
            });
        })
        .catch(error => console.error('Error:', error));
}
