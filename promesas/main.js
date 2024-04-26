 //Exercici 2.1 Async/await
 
  async function pokeCards() {
    const startTime = new Date().getTime(); // Tiempo de inicio
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      const pokemonList = data.results.slice(0, 12); // Obtiene los primeros 12 pokémones
      const pokemonArray = [];
  
      for (const pokemon of pokemonList) {
        const pokemonResponse = await fetch(pokemon.url);
        if (!pokemonResponse.ok) {
          throw new Error("Network response for pokemon was not ok");
        }
        const pokemonData = await pokemonResponse.json();
        const pokemonInfo = {
          name: pokemonData.name,
          id: pokemonData.id,
          types: pokemonData.types.map((tipo) => tipo.type.name),
          weight: pokemonData.weight,
          height: pokemonData.height,
        };
        pokemonArray.push(pokemonInfo);
      }
  
      // Mostrar los pokémons en pantalla
      displayPokemon(pokemonArray);
      
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      const endTime = new Date().getTime(); // Tiempo de finalización
      const elapsedTime = endTime - startTime; // Calcular el tiempo transcurrido en milisegundos
      const timeText = `TIEMPO: ${elapsedTime.toFixed(2)} milisegundos`; //Convierte el número a notación de punto fijo con digits decimales.
      // Actualizar el texto del botón
      const button = document.querySelector(".btn-primary"); // Puedes ajustar el selector según el botón correspondiente
      button.textContent = `Exercici 2.1 ${timeText}`;
    }
  }
  
  function displayPokemon(pokemonArray) {
    const pokeCardsContainer = document.getElementById("pokeCards");
  
    pokemonArray.forEach((pokemon) => {
      const cardColumn = document.createElement("div");
      cardColumn.classList.add("col-md-3"); // Ajustar el tamaño de la columna según sea necesario
      cardColumn.innerHTML = `
              <div class="card shadow">
                  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                    pokemon.id
                  }.png" class="card-img-top" alt="${pokemon.name}">
                  <div class="card-body">
                      <h5 class="card-title">${pokemon.name}</h5>
                      <div class="card-text">ID: ${pokemon.id}</div>
                      <div class="card-text">Tipo: ${pokemon.types.join(
                        ", "
                      )}</div>
                      <div class="card-text">Peso: ${pokemon.weight}</div>
                      <div class="card-text">Altura: ${pokemon.height}</div>
                  </div>
              </div>
          `;
      pokeCardsContainer.appendChild(cardColumn);
    });
  }
  document.querySelector(".btn-primary").addEventListener("click", pokeCards);
  
  //Exercici 2.2 .then/.catch/.finally
  // Fes el mateix exercici però fent servir .then/catch, ara encavalcant les peticions, de manera que els pokemos es mostrin en l'ordre correcte.
  // Mostra al costat del botó el temps que s'ha fet servir.
  // Actualitza la lògica perquè en prémer el botó corresponent es cridi aquesta funció i es mostri per pantalla els pokemons de l'array obtingut.
  
  function fetchPokemon() {
    
  
    const startTime = new Date().getTime(); // Tiempo de inicio
  
    fetch("https://pokeapi.co/api/v2/pokemon")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const pokemonList = data.results.slice(0, 12); // Obtiene los primeros 12 pokémones
        const pokemonArray = [];
        console.log(pokemonArray);
        // Encadenar las peticiones utilizando then encadenados
        let chain = null;
        pokemonList.forEach((pokemon) => {
          if (chain === null) {
            chain = fetch(pokemon.url)
              .then((pokemonResponse) => {
                if (!pokemonResponse.ok) {
                  throw new Error("Network response for pokemon was not ok");
                }
                return pokemonResponse.json();
              })
              .then((pokemonData) => {
                const pokemonInfo = {
                  name: pokemonData.name,
                  id: pokemonData.id,
                  types: pokemonData.types.map((tipo) => tipo.type.name),
                  weight: pokemonData.weight,
                  height: pokemonData.height,
                };
                pokemonArray.push(pokemonInfo);
              });
          } else {
            chain = chain.then(() => {
              return fetch(pokemon.url)
                .then((pokemonResponse) => {
                  if (!pokemonResponse.ok) {
                    throw new Error("Network response for pokemon was not ok");
                  }
                  return pokemonResponse.json();
                })
                .then((pokemonData) => {
                  const pokemonInfo = {
                    name: pokemonData.name,
                    id: pokemonData.id,
                    types: pokemonData.types.map((tipo) => tipo.type.name),
                    weight: pokemonData.weight,
                    height: pokemonData.height,
                  };
                  pokemonArray.push(pokemonInfo);
                });
            });
          }
        });
  
        return chain.then(() => pokemonArray);
      })
      .then((pokemonArray) => {
        displayPokemon(pokemonArray);

      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      })
      .finally(() => {
        const endTime = new Date().getTime(); // Tiempo de finalización
        const elapsedTime = endTime - startTime; // Calcular el tiempo transcurrido en milisegundos
        const timeText = `TIEMPO: ${elapsedTime.toFixed(2)} milisegundos`; //Convierte el número a notación de punto fijo con digits decimales.
        // Actualizar el texto del botón
        const button = document.querySelector(".btn-success"); // Puedes ajustar el selector según el botón correspondiente
        button.textContent = `Exercici 2.2 ${timeText}`;
      });
  }
  
  document.querySelector(".btn-success").addEventListener("click", fetchPokemon);
  
  // Exercici 2.3 Promise.All
  // Fes el mateix exercici fent servir fetch i .then perquè totes les peticions es facin a l'hora.
  // Utilitza Promise.all, de manera que les dades es mostrin per pantalla una vegada s'han resolt totes les peticions.
  // Mostra el temps total que ha trigat.
  // Actualitza la lògica perquè en prémer el botó corresponent es cridi aquesta funció i es mostri per pantalla els pokemons de l'array obtingut.
  function fetchPokeballParade() {
  
    const startTime = new Date().getTime(); // Tiempo de inicio
  
    fetch("https://pokeapi.co/api/v2/pokemon")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const pokemonList = data.results.slice(0, 12); // Obtiene los primeros 12 pokémones
        const pokemonPromises = [];
  
        // Crear un array de promesas para todas las peticiones de Pokémon
        pokemonList.forEach((pokemon) => {
          pokemonPromises.push(fetch(pokemon.url)
            .then((pokemonResponse) => {
              if (!pokemonResponse.ok) {
                throw new Error("Network response for pokemon was not ok");
              }
              return pokemonResponse.json();
            })
            .then((pokemonData) => ({
              name: pokemonData.name,
              id: pokemonData.id,
              types: pokemonData.types.map((tipo) => tipo.type.name),
              weight: pokemonData.weight,
              height: pokemonData.height,
            }))
          );
        });
  
        // Esperar a que todas las promesas se resuelvan
        return Promise.all(pokemonPromises);
      })
      .then((pokemonArray) => {
        // Mostrar los Pokémon en pantalla una vez se han resuelto todas las peticiones
        displayPokemon(pokemonArray);
        // Borrar las fichas después de cierto tiempo (por ejemplo, 5 segundos)
        
  
        // Calcular el tiempo total transcurrido
        const endTime = new Date().getTime();
        const elapsedTime = endTime - startTime;
        const timeText = `TIEMPO: ${elapsedTime.toFixed(2)} milisegundos`;
  
        // Actualizar el texto del botón
        const button = document.querySelector(".btn-warning");
        button.textContent = `Exercici 2.3 ${timeText}`;
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
  
  document.querySelector(".btn-warning").addEventListener("click", fetchPokeballParade);