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

