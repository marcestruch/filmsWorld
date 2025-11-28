(() => {
    const apiKey = "013abb2fee899b7766b393fb002529dc";
    const totalPages = 5;
    let allPelis = [];

    //fetch pelis desde API
    async function fetchAllMovies() {
        let movies = [];
        for (let page = 1; page <= totalPages; page++) {
            const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`);
            const data = await res.json();
            movies = movies.concat(data.results);
        }
        return movies;
    }

    //metodo para generar tarjetas de peliculas
    function generarTarjetas(pelis) {
        const movieGrid = document.querySelector('.movie-grid');
        movieGrid.innerHTML = '';

        pelis.forEach(peli => {
            const { title, overview, backdrop_path, popularity, release_date, vote_average } = peli;

            const newDiv = document.createElement('div');
            newDiv.className = "movie-card";

            const imgPeli = document.createElement('img');
            imgPeli.src = backdrop_path ? `https://image.tmdb.org/t/p/w500${backdrop_path}` : './imgs/logo.PNG';
            newDiv.appendChild(imgPeli);

            const newDivContent = document.createElement('div');
            newDivContent.className = "content";

            const tituloPeli = document.createElement('h3');
            tituloPeli.textContent = title;
            newDivContent.appendChild(tituloPeli);

            const descripcion = document.createElement('p');
            descripcion.textContent = overview ? overview.substring(0, 100) + '...' : 'Sin descripción';
            newDivContent.appendChild(descripcion);

            const popu = document.createElement('p');
            popu.textContent = "Popularity: " + (popularity ? popularity : 0);
            newDivContent.appendChild(popu);

            const releaseDate = document.createElement('p');
            releaseDate.textContent = "Release date: " + (release_date ? release_date : '0000-00-00');
            newDivContent.appendChild(releaseDate);

            const voteAverage = document.createElement('p');
            voteAverage.textContent = "Vote average: " + (vote_average ? vote_average : '0');
            newDivContent.appendChild(voteAverage);

            newDiv.appendChild(newDivContent);
            movieGrid.appendChild(newDiv);
        });
    }

    //generar tarjetas
    async function init() {
        allPelis = await fetchAllMovies();
        generarTarjetas(allPelis);
    }

    init();

    //ordenar
    const ordenarSelect = document.getElementById('ordenar');
    ordenarSelect.addEventListener('change', () => {
        const ordenar = ordenarSelect.value;

        if (ordenar && allPelis.length) {
            let pelisOrdenadas = [...allPelis];

            if (ordenar === "release_date") {
                pelisOrdenadas.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            } else {
                pelisOrdenadas.sort((a, b) => (b[ordenar] || 0) - (a[ordenar] || 0));
            }

            generarTarjetas(pelisOrdenadas);
        }
    });

    //buscar 
    const buscarBtn = document.getElementById("buscarBtn");
    buscarBtn.addEventListener('click', () => {
        const inputBuscar = document.getElementById("inputBuscar").value.trim().toLowerCase();

        if (!inputBuscar.length) return;

        const resultados = allPelis.filter(peli =>
            peli.title.toLowerCase().includes(inputBuscar)
        );

        generarTarjetas(resultados);
    });

})();
