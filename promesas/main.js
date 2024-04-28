 //Exercici 2.1 Async/await
 
  async function pokeCartas() {
    const inicioTiempo = new Date().getTime();
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon");
      if (!response.ok) {
        throw new Error("Fallo al conectar");
      }
      const data = await response.json();
      console.log(data);
      const listaPokemon = data.results.slice(0, 12);
      const pokemonArray = [];
  
      for (const pokemon of listaPokemon) {
        const pokemonResponse = await fetch(pokemon.url);
        if (!pokemonResponse.ok) {
          throw new Error("Fallo al conectar");
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
  
      
      displayPokemon(pokemonArray);
      
    } catch (error) {
      console.error("Problema con la operacion:", error);
    } finally {
      const finTIempo = new Date().getTime(); 
      const elapsedTime = finTIempo - inicioTiempo; 
      const timeText = `TIEMPO: ${elapsedTime.toFixed(2)} milisegundos`; 
      // Actualizar el texto del botón
      const button = document.querySelector(".btn-primary"); 
      button.textContent = `Exercici 2.1 ${timeText}`;
    }
  }
  
  function displayPokemon(pokemonArray) {
    const pokeCartasContainer = document.getElementById("pokeCartas");
  
    pokemonArray.forEach((pokemon) => {
      const cardColumn = document.createElement("div");
      cardColumn.classList.add("col-md-3"); 
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
      pokeCartasContainer.appendChild(cardColumn);
    });
  }
  document.querySelector(".btn-primary").addEventListener("click", pokeCartas);
  
  //Exercici 2.2 .then/.catch/.finally
  
  function fetchPokemon() {
    
  
    const inicioTiempo = new Date().getTime(); 
  
    fetch("https://pokeapi.co/api/v2/pokemon")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fallo al conectar");
        }
        return response.json();
      })
      .then((data) => {
        const listaPokemon = data.results.slice(0, 12); 
        const pokemonArray = [];
        console.log(pokemonArray);
        
        let chain = null;
        listaPokemon.forEach((pokemon) => {
          if (chain === null) {
            chain = fetch(pokemon.url)
              .then((pokemonResponse) => {
                if (!pokemonResponse.ok) {
                  throw new Error("Fallo al conectar");
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
                    throw new Error("Fallo al conectar");
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
        console.error("Problema con la operacion:", error);
      })
      .finally(() => {
        const finTIempo = new Date().getTime(); 
        const elapsedTime = finTIempo - inicioTiempo; 
        const timeText = `TIEMPO: ${elapsedTime.toFixed(2)} milisegundos`; 
        // Actualizar el texto del botón
        const button = document.querySelector(".btn-success"); 
        button.textContent = `Exercici 2.2 ${timeText}`;
      });
  }
  
  document.querySelector(".btn-success").addEventListener("click", fetchPokemon);
  
  // Exercici 2.3 Promise.All
  function fetchPokeballParade() {
  
    const inicioTiempo = new Date().getTime(); 
  
    fetch("https://pokeapi.co/api/v2/pokemon")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fallo al conectar");
        }
        return response.json();
      })
      .then((data) => {
        const listaPokemon = data.results.slice(0, 12); 
        const pokemonPromises = [];
  
        
        listaPokemon.forEach((pokemon) => {
          pokemonPromises.push(fetch(pokemon.url)
            .then((pokemonResponse) => {
              if (!pokemonResponse.ok) {
                throw new Error("Fallo al conectar");
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
  
        
        return Promise.all(pokemonPromises);
      })
      .then((pokemonArray) => {
        displayPokemon(pokemonArray);
  
        const finTIempo = new Date().getTime();
        const elapsedTime = finTIempo - inicioTiempo;
        const timeText = `TIEMPO: ${elapsedTime.toFixed(2)} milisegundos`;
        const button = document.querySelector(".btn-warning");
        button.textContent = `Exercici 2.3 ${timeText}`;
      })
      .catch((error) => {
        console.error("Problema con la operacion:", error);
      });
  }
  
  document.querySelector(".btn-warning").addEventListener("click", fetchPokeballParade);