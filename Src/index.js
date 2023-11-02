// Get references to HTML elements
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// Function to load movies from the OMDB API based on the search term
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=f00de05`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    console.log(data.Search); // Logging the movie search results to the console
    if(data.Response == "True") displayMovieList(data.Search);
}





// Function to initiate movie search
function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm); // Calling the function to load movies based on the search term
    } else {
        searchList.classList.add('hide-search-list');
    }
}

// Function to display the list of movies in the search results
function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let item = 0; item < movies.length; item++){
        // Creating individual movie search result items
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[item].imdbID; // Setting movie ID in data-id attribute
        movieListItem.classList.add('search-list-item');
        let moviePoster = (movies[item].Poster != "N/A") ? movies[item].Poster : "image_not_found.png"; // Handling missing movie posters
        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[item].Title}</h3>
            <p>${movies[item].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails(); // Calling the function to load movie details when a search result is clicked
}

// Function to load and display detailed information about the selected movie
function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            // Fetching detailed information about the selected movie using its ID
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=f00de05`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails); // Calling the function to display movie details
        });
    });
}

// Function to display detailed movie information in the result grid
function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <!-- Displaying various movie details such as title, year, ratings, released date, etc. -->
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    `;
}

// Event listener to hide search results when clicking outside the search box
window.addEventListener('click', (event) => {
    if(event.target.className != "entry"){
        searchList.classList.add('hide-search-list');
    }
});
