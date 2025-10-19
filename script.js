const apiKey = 'abde174a';

document.getElementById('searchBtn').addEventListener('click', () => {
    const movieName = document.getElementById('movieInput').value;
    fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => displayMovie(data))
        .catch(err => console.log(err));
});

function displayMovie(movie) {
    if(movie.Response === "False") {
        document.getElementById('movieResult').innerHTML = "Movie not found!";
        return;
    }

    const sources = movie.Ratings.map(r => r.Source);
    const values = movie.Ratings.map(r => {
        if (r.Value.includes('%')) {
            // Already a percentage
            return parseInt(r.Value);
        } else if (r.Value.includes('/')) {
            const parts = r.Value.split('/');
            const numerator = parseFloat(parts[0]);
            const denominator = parseFloat(parts[1]);
            // Convert to percentage
            return (numerator / denominator) * 100;
        } else {
            return 0;
        }
    });

    document.getElementById('movieResult').innerHTML = `
        <h2>${movie.Title} (${movie.Year})</h2>
        <img src="${movie.Poster}" alt="${movie.Title}" width="200">
        <p>${movie.Plot}</p>
        <canvas id="ratingChart" width="400" height="200"></canvas>
    `;

    new Chart(document.getElementById('ratingChart'), {
        type: 'bar',
        data: {
            labels: sources,
            datasets: [{
                label: 'Rating (%)',
                data: values,
                backgroundColor: ['red','green','blue']
            }]
        },
        options: { scales: { y: { beginAtZero: true, max: 100 } } }
    });
}