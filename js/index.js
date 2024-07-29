const API_URL = 'https://api.rawg.io/api/games';
const API_KEY = 'dc8cb8335b4f4d8b82df6b1e3e73a12e'; 
const gamesContainer = document.getElementById('games-container');
const searchInput = document.getElementById('search-input');
const genreFilter = document.getElementById('genre-filter');
const sortOptions = document.getElementById('sort-options');

let allGames = [];

async function fetchGames() {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}&page_size=50`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        return [];
    }
}


function displayGames(games) {
    gamesContainer.innerHTML = '';
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.background_image}" alt="${game.name}">
            <h3>${game.name}</h3>
            <p>Género: ${game.genres.map(g => g.name).join(', ')}</p>
            <p>Rating: ${game.rating}</p>
        `;
        gamesContainer.appendChild(gameCard);
    });
}


function filterByGenre(games, genre) {
    return genre ? games.filter(game => game.genres.some(g => g.name === genre)) : games;
}


function searchGames(games, query) {
    return query ? games.filter(game => game.name.toLowerCase().includes(query.toLowerCase())) : games;
}


function sortGames(games, criteria) {
    return games.slice().sort((a, b) => {
        if (criteria === 'name') {
            return a.name.localeCompare(b.name);
        } else if (criteria === 'rating') {
            return b.rating - a.rating;
        }
        return 0;
    });
}


function updateDisplayedGames() {
    let filteredGames = filterByGenre(allGames, genreFilter.value);
    filteredGames = searchGames(filteredGames, searchInput.value);
    filteredGames = sortGames(filteredGames, sortOptions.value);
    displayGames(filteredGames);
}


function loadGenres(games) {
    const genres = [...new Set(games.flatMap(game => game.genres.map(g => g.name)))];
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    allGames = await fetchGames();
    loadGenres(allGames);
    updateDisplayedGames();

    
    searchInput.addEventListener('input', updateDisplayedGames);
    genreFilter.addEventListener('change', updateDisplayedGames);
    sortOptions.addEventListener('change', updateDisplayedGames);
});



document.addEventListener("DOMContentLoaded", () => {
    const timerElement = document.getElementById('timer');
    let startTime = Date.now();
    let timeoutId;

    function updateTimer() {
        let elapsedTime = Date.now() - startTime;

        let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        elapsedTime -= hours * (1000 * 60 * 60);

        let minutes = Math.floor(elapsedTime / (1000 * 60));
        elapsedTime -= minutes * (1000 * 60);

        let seconds = Math.floor(elapsedTime / 1000);

        timerElement.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

       
        timeoutId = setTimeout(updateTimer, 1000);
    }

    function pad(number) {
        return number.toString().padStart(2, '0');
    }

    
    updateTimer();

   
});