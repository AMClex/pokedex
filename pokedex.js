const baseUrl = 'https://pokeapi.co/api/v2/pokemon/'

async function fetchPokemon(pokemonNameOrId) {
  let url = baseUrl + pokemonNameOrId;

  const response = await fetch(url);

  if (response.ok === false) {
    throw new Error('Erreur de récupération des données du Pokémon');
  }

  return response.json();
}

function updatePokemonDOM(pokemon) {
  document.getElementById('statsTitle').innerText = "Statistiques"
  document.getElementById('type').innerText = "Type : " + pokemon.types.map(type => type.type.name).join(' / ');
  document.getElementById('titrePokedex').innerText = pokemon.name + ' - ' + 'n°' + pokemon.id;
  document.getElementById('taille').innerText = "Taille : " + (pokemon.height / 10) + "m";
  document.getElementById('poids').innerText = "Poids : " + (pokemon.weight / 10) + "kg";
  document.getElementById('hp').innerText = "HP : " + pokemon.stats[0].base_stat;
  document.getElementById('attack').innerText = "Attaque : " + pokemon.stats[1].base_stat;
  document.getElementById('defense').innerText = "Defense : " + pokemon.stats[2].base_stat;
  document.getElementById('specialAttack').innerText = "Attaque spéciale : " + pokemon.stats[3].base_stat;
  document.getElementById('specialDefense').innerText = "Défense spéciale : " + pokemon.stats[4].base_stat;
  document.getElementById('speed').innerText = "Vitesse : " + pokemon.stats[5].base_stat;

  if(pokemon.id <= 9) {
    document.getElementById('image').src = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + "00" + pokemon.id + '.png';
  }
  else if(pokemon.id > 10 && pokemon.id < 100) {
    document.getElementById('image').src = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + "0" + pokemon.id + '.png';
  }

  else {
    document.getElementById('image').src = 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + + pokemon.id + '.png';
  }
  
  let talentCount = pokemon.abilities.length;
  let dropdown = document.getElementById('talent');

  if (!dropdown) {
    dropdown = document.createElement('select');
    dropdown.id = 'talent';
    document.body.appendChild(dropdown);
  } else {
    dropdown.innerHTML = '';
  }

  for (let i = 0; i < talentCount; i++) {
    let option = document.createElement('option');
    option.text = pokemon.abilities[i].ability.name;
    dropdown.appendChild(option);
  }
}

async function fetchPokemonSpecies(pokemonNameOrId) {
  let genderUrl = 'https://pokeapi.co/api/v2/pokemon-species/' + pokemonNameOrId;

  const response = await fetch(genderUrl);

  if (response.ok === false) {
    throw new Error('Erreur de récupération des données de sexe du Pokémon');
  }

  return response.json();
}

function updatePokemonSpeciesDOM(pokemon) {
  document.getElementById('categorie').innerText = "Catégorie : " + pokemon.genera[3].genus;
  if (pokemon.gender_rate !== -1) {
    document.getElementById('sexe').innerText = "Sexe : ♂ ♀";
  } else {
    document.getElementById('sexe').innerText = "Sexe : Inconnu";
  }

  let evolutionUrl = pokemon.evolution_chain.url;
  fetch(evolutionUrl)
    .then(response => {
      if (!response.ok) {
        alert('Nom de Pokémon invalide ou site de l\'API inaccessible. Veuillez réessayer.');
        throw new Error('Erreur de récupération des données de sexe du Pokémon');
      }
      return response.json();
    })
    .then(data => {
      if (data.chain.evolves_to.length < 1) {
        document.getElementById('evolveFrom').innerText = "Pré-évolution : Aucune";
        document.getElementById('evolveInto').innerText = "Évolution : Aucune";
      } else {
        let hiddenUi = pokemon.name;
        console.log({hiddenUi});
        if (hiddenUi === data.chain.species.name) {
          document.getElementById('evolveFrom').innerText = "Pré-évolution : Aucune";
          document.getElementById('evolveInto').innerHTML = `Évolution : <a href="./pokedex.html?pokemon=${data.chain.evolves_to[0].species.name}">${data.chain.evolves_to[0].species.name}</a>`;
        } else if (hiddenUi === data.chain.evolves_to[0].species.name) {
          document.getElementById('evolveFrom').innerHTML = `Pré-évolution : <a href="./pokedex.html?pokemon=${data.chain.species.name}">${data.chain.species.name}</a>`
          document.getElementById('evolveInto').innerHTML = `Évolution : <a href="./pokedex.html?pokemon=${data.chain.evolves_to[0].evolves_to[0].species.name}">${data.chain.evolves_to[0].evolves_to[0].species.name}</a>`;
        } else {
          document.getElementById('evolveFrom').innerHTML = `Pré-évolution : <a href="./pokedex.html?pokemon=${data.chain.evolves_to[0].species.name}">${data.chain.evolves_to[0].species.name}</a>`;
          document.getElementById('evolveInto').innerText = "Évolution : Aucune";
        }
      }
    })
}

async function searchPokemon(pokemonNameOrId) {
  let affichage = document.getElementById('down-element');
  let errorElement = document.getElementById('error-element');
  affichage.style.display = 'none';
  errorElement.style.display = 'none';

  try {
    const pokemon = await fetchPokemon(pokemonNameOrId);
    const pokemonSpecies = await fetchPokemonSpecies(pokemonNameOrId)
    updatePokemonDOM(pokemon);
    updatePokemonSpeciesDOM(pokemonSpecies);
    affichage.style.display = 'flex';
  } catch (error) {
    errorElement.innerText = "Nom de Pokémon invalide ou site de l\'API inaccessible. Veuillez réessayer."
    errorElement.style.display = 'flex';
  }
}

function main() {
  let urlParams = new URLSearchParams(window.location.search);
  let pokemon = urlParams.get('pokemon');

  if (pokemon === "" || pokemon === null || pokemon === undefined) {
    return;
  }
  
  searchPokemon(pokemon)
}

function onPokemonSearch() {
  let pokemon = document.getElementById('userInput').value.trim();
  searchPokemon(pokemon)
}

main();