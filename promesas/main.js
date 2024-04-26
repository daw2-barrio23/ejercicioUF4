

//EJERCICIO 2.1
// Función para generar las tarjetas
function generarTarjetas(array) {
  const contenedor = document.querySelector('.row'); // aqui pegaremos las tarjetas
  array.forEach(pokemon => {
      const card = document.createElement('div');
      card.classList.add('col-md-2');
      const cardHTML = `
          <div class="card shadow">
              <img src="${pokemon.imagen}" class="card-img-top" alt="${pokemon.nombre}">
              <div class="card-body">
                  <h5 class="card-title">${pokemon.nombre}</h5>
                  <div class="card-text">ID: ${pokemon.id}</div>
                  <div class="card-text">Tipo: ${pokemon.tipo}</div>
                  <div class="card-text">Peso: ${pokemon.peso}</div>
                  <div class="card-text">Altura: ${pokemon.altura}</div>
              </div>
          </div>
      `;
      card.innerHTML = cardHTML;
      contenedor.appendChild(card);
  });
}

// Función API de PokeAPI
async function obtenerDatosPokemon() {
  try {
      const inicio = Date.now(); // Registrar el tiempo de inicio 
      //solicitud a API para obtener los primeros 12 Pokémons
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
      // Convertir la respuesta a formato JSON
      const data = await response.json();
      // Extraer la URL 
      const pokemonUrls = data.results.map(pokemon => pokemon.url);
      // almacenamos la informacion de los poekmons
      const pokemonPromises = pokemonUrls.map(async url => {
          const response = await fetch(url);
          return response.json();
      });
      // Esperamos a todas las promesas
      const pokemonInfos = await Promise.all(pokemonPromises);
      // Calcular el tiempo transcurrido
      const tiempoTranscurrido = Date.now() - inicio;
      // Formatear la informacion de los Pokemons
      const pokemonData = pokemonInfos.map(pokemonInfo => ({
          id: pokemonInfo.id,
          nombre: pokemonInfo.name,
          imagen: pokemonInfo.sprites.other['official-artwork'].front_default,
          tipo: pokemonInfo.types.map(type => type.type.name),
          peso: pokemonInfo.weight,
          altura: pokemonInfo.height
      }));
      // Devolver el array con la info de los pokemons y el tiempo transcurrido
      return { pokemonData, tiempoTranscurrido };
  } catch (error) {
      console.error('Error al obtener los datos de los Pokémon:', error);
      // en caso error devolvemos el array vacío y el teimpo será 0
      return { pokemonData: [], tiempoTranscurrido: 0 };
  }
}

// Función para generar las tarjetas 
async function generarTarjetasPokemon() {
  console.log('Ejercicio 2.1')
  try {
      const { pokemonData, tiempoTranscurrido } = await obtenerDatosPokemon();

      // Mostrar el tiempo transcurrido
      const boton1 = document.querySelector('.boton1');
      boton1.innerHTML = `<div><strong>Exercici 2.1</strong></div><div>TIEMPO: ${tiempoTranscurrido} milisegundos</div>`;

      // Mostramos los cards de los pokemons
      const pokemonsContainer = document.getElementById('pokemonsContainer');
      pokemonsContainer.classList.remove('hidden');

      console.log('Datos de los primeros 12 Pokémon:', pokemonData);

      // se generan los cards
      generarTarjetas(pokemonData);

  } catch (error) {
      console.error('Error al generar los cards: ', error);
  }
}




//EJERCICIO 2.2
// Función API de PokeAPI utilizando then/catch
function obtenerDatosPokemonThenCatch() {
  console.log('Ejercicio 2.2')
  const inicio = Date.now(); // Registrar el tiempo de inicio 
  fetch('https://pokeapi.co/api/v2/pokemon?limit=12')
      .then(response => {
          return response.json();
      })
      .then(data => {
          const pokemonUrls = data.results.map(pokemon => pokemon.url);
          const pokemonPromises = pokemonUrls.map(url => fetch(url).then(response => response.json()));
          return Promise.all(pokemonPromises);
      })
      .then(pokemonInfos => {
          const tiempoTranscurrido = Date.now() - inicio;
          const pokemonData = pokemonInfos.map(pokemonInfo => ({
              id: pokemonInfo.id,
              nombre: pokemonInfo.name,
              imagen: pokemonInfo.sprites.other['official-artwork'].front_default,
              tipo: pokemonInfo.types.map(type => type.type.name),
              peso: pokemonInfo.weight,
              altura: pokemonInfo.height
          }));
          return { pokemonData, tiempoTranscurrido };
      })
      .then(({ pokemonData, tiempoTranscurrido }) => {
          const boton2 = document.querySelector('#boton2');
          boton2.innerHTML = `<div><strong>Exercici 2.2</strong></div><div>TIEMPO: ${tiempoTranscurrido} milisegundos</div>`;
          const pokemonsContainer = document.getElementById('pokemonsContainer');
          pokemonsContainer.classList.remove('hidden');
          generarTarjetas(pokemonData);
          console.log('Datos de los primeros 12 Pokémon:', pokemonData);
      })
      .catch(error => {
          console.error('Error al obtener los datos de los Pokémon:', error);
      });
}




//Ejercicio 2.3
function obtenerDatosPokemonFetchAll() {
  const inicio = Date.now(); // Tiempo de inicio
  // Realizar la solicitud a la API para obtener los pokemons
  fetch('https://pokeapi.co/api/v2/pokemon?limit=12')
      .then(response => {
          if (!response.ok) {
              throw new Error('No se pudo obtener la información de los Pokémon');
          }
          return response.json();
      })
      .then(data => {
          // Extraer la URL 
          const pokemonUrls = data.results.map(pokemon => pokemon.url);
          // Realizar todas las solicitudes con el map
          return Promise.all(pokemonUrls.map(url => fetch(url)));
      })
      .then(pokemonResponses => {
      // Obtener la info
      return Promise.all(pokemonResponses.map(response => response.json()));
      })
      .then(pokemonInfos => {
          // Calcular el tiempo transcurrido
          const tiempoTranscurrido = Date.now() - inicio;
          // Formatear la info
          const pokemonData = pokemonInfos.map(pokemonInfo => ({
              id: pokemonInfo.id,
              nombre: pokemonInfo.name,
              imagen: pokemonInfo.sprites.other['official-artwork'].front_default,
              tipo: pokemonInfo.types.map(type => type.type.name),
              peso: pokemonInfo.weight,
              altura: pokemonInfo.height
          }));
          // Mostrar el tiempo transcurrido
          const boton3 = document.querySelector('#boton3');
          boton3.innerHTML = `<div><strong>Exercici 2.3</strong></div><div>TIEMPO: ${tiempoTranscurrido} milisegundos</div>`;
          // Mostrar los cards de los pokemons
          const pokemonsContainer = document.getElementById('pokemonsContainer');
          pokemonsContainer.classList.remove('hidden');
          // Generar las tarjetas de los pokemons
          generarTarjetas(pokemonData);
          console.log('Datos de los 12 Pokemons:', pokemonData);
      })
      .catch(error => {
          console.error('Error al obtener los datos', error);
      });
}

//Eventos de los clicks para mostrar todo

document.addEventListener('DOMContentLoaded', () => {
  console.log('Hola desde el main')
  // Evento click para el boton1
  document.querySelector('#boton1').addEventListener('click', () => {
      //Se generaran los cards cuando se haga click
      generarTarjetasPokemon();
  });
  // Evento click para el boton2
  document.querySelector('#boton2').addEventListener('click', () => {
      obtenerDatosPokemonThenCatch();
  });
  //Evento click para el boton3
  document.querySelector('#boton3').addEventListener('click', () => {
      obtenerDatosPokemonFetchAll();
  });
});