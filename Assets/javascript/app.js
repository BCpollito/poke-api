let pagina = 1;

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const tipopokemon = document.getElementById("buscarbtn");
const tipoPokemonInput = document.getElementById("tipoPokemon");

btnSiguiente.addEventListener("click", () => {
    if (pagina < 1000) {
        pagina += 1;
        cargarPokemons();
        cargarPokemons();
        window.scrollTo({
            top: 0,
        });
    }
})

btnAnterior.addEventListener("click", () => {
    if (pagina > 1) {
        pagina -= 1;
        cargarPokemons();
        window.scrollTo({
            top: 0,
        });
    }
})

tipopokemon.addEventListener("click", () =>{
    const tipo = tipoPokemonInput.value.toLowerCase().trim();
    if (tipo) {
        buscarPokemonPorTipo(tipo);
    }
})


const cargarPokemons = async () => {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(pagina - 1) * 20}`);

        if (respuesta.status === 200) {
            const datos = await respuesta.json();
            console.log(respuesta);

            const promises = datos.results.map(pokemon => fetch(pokemon.url).then(response => response.json()));
            const pokemonsData = await Promise.all(promises);

            let pokemons = '';

            pokemonsData.forEach(pokemonData => {
                console.log(pokemonData);
                const tipos = pokemonData.types.map(typeInfo => typeInfo.type.name).join(', ');
                pokemons += `
                    <div class="pokemon">
                        <h1 class="nombre">${pokemonData.name}</h1>
                        <div class="image-container"><img class="sprite" src="${pokemonData.sprites.front_default}"></div>
                        <span class ="tipo">Tipo: ${tipos}</span>
                    </div>
                `;
            });

            document.getElementById("pokemones").innerHTML = pokemons;

        }else {
            console.error("Respuesta de la API no fue exitosa:", respuesta.status);
        }

    } catch (error) {
        console.error("hay un peo mano: ", error);
    }
}

const buscarPokemonPorTipo = async (tipo) =>{
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
        if (respuesta.status === 200) {
            const datos = await respuesta.json();
            console.log(datos);

            const promises = datos.pokemon.map(pokemonInfo => fetch(pokemonInfo.pokemon.url).then(response => response.json()));
            const pokemonsData = await Promise.all(promises);

            let pokemons = '';

            pokemonsData.forEach(pokemonData => {
                const tipos = pokemonData.types.map(typeInfo => typeInfo.type.name).join(', ');
                pokemons += `
                    <div class="pokemon">
                        <h1 class="nombre">${pokemonData.name}</h1>
                        <div class="image-container"><img class="sprite" src="${pokemonData.sprites.front_default}"></div>
                        <span class ="tipo">Tipo: ${tipos}</span>
                    </div>
                `;
            });

            document.getElementById("pokemones").innerHTML = pokemons;
        } else {
            console.error("respuesta de la API no fue exitosa")
        }
    } catch (error) {
        console.error(error)
    }
}

cargarPokemons();

