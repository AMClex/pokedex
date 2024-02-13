function infoPokemon() {
  const baseUrl = 'https://pokeapi.co/api/v2/pokemon/'
  let pokemonUrl = document.getElementById('userInput').value.trim();
  let url = baseUrl + pokemonUrl;
  let genderUrl = 'https://pokeapi.co/api/v2/pokemon-species/' + pokemonUrl;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        alert('Nom de Pokémon invalide ou site de l\'API inaccessible. Veuillez réessayer.');
        throw new Error('Erreur de récupération des données du Pokémon');
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('name').innerText = "Nom : " + data.name;
      document.getElementById('type').innerText = "Type : " + data.types.map(type => type.type.name).join(' / ');
      document.getElementById('titrePokedex').innerText = data.name + ' - ' + 'n°' + data.id;
      document.getElementById('taille').innerText = "Taille : " + (data.height / 10) + "m";
      document.getElementById('poids').innerText = "Poids : " + (data.weight / 10) + "kg";
      document.getElementById('hp').innerText = "HP : " + data.stats[0].base_stat;
      document.getElementById('attack').innerText = "Attaque : " + data.stats[1].base_stat;
      document.getElementById('defense').innerText = "Defense : " + data.stats[2].base_stat;
      document.getElementById('specialAttack').innerText = "Attaque spéciale : " + data.stats[3].base_stat;
      document.getElementById('specialDefense').innerText = "Défense spéciale : " + data.stats[4].base_stat;
      document.getElementById('speed').innerText = "Vitesse : " + data.stats[5].base_stat;
      document.getElementById('image').src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + data.id + '.png';
      
      let talentCount = data.abilities.length;
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
        option.text = data.abilities[i].ability.name;
        dropdown.appendChild(option);
      }
    })
    .catch(error => {
      console.error(error);
    });

  fetch(genderUrl)
    .then(response => {
      if (!response.ok) {
        alert('Nom de Pokémon invalide ou site de l\'API inaccessible. Veuillez réessayer.');
        throw new Error('Erreur de récupération des données de sexe du Pokémon');
      }
      return response.json();
    })
    .then(data => {
      
      document.getElementById('categorie').innerText = "Catégorie : " + data.genera[3].genus;

      if (data.gender_rate !== -1) {
        document.getElementById('sexe').innerText = "Sexe : ♂ ♀";
      } else {
        document.getElementById('sexe').innerText = "Sexe : Inconnu";
      }

      let evolutionUrl = data.evolution_chain.url;
      fetch(evolutionUrl)
        .then(response => {
          if (!response.ok) {
            alert('Nom de Pokémon invalide ou site de l\'API inaccessible. Veuillez réessayer.');
            throw new Error('Erreur de récupération des données de sexe du Pokémon');
          }
          return response.json();
        })
        .then(data => {
          if(data.chain.evolves_to.length < 1) {
            document.getElementById('evolveFrom').innerText = "Pré-évolution : Aucune";
            document.getElementById('evolveInto').innerText = "Évolution : Aucune";
          }
          else {
            if (document.getElementById('hidden').innerText === data.chain.species.name) {
              document.getElementById('evolveFrom').innerText = "Pré-évolution : Aucune";
              document.getElementById('evolveInto').innerText = "Évolution : " + data.chain.evolves_to[0].species.name;
            }
            else if (document.getElementById('hidden').innerText === data.chain.evolves_to[0].species.name) {
              document.getElementById('evolveFrom').innerText = "Pré-évolution : " + data.chain.species.name;
              document.getElementById('evolveInto').innerText = "Évolution : " + data.chain.evolves_to[0].evolves_to[0].species.name;
            }
            else {
              document.getElementById('evolveFrom').innerText = "Pré-évolution : " + data.chain.evolves_to[0].species.name;
              document.getElementById('evolveInto').innerText = "Évolution : Aucune";
            }
          }
        })
    })
    
    .catch(error => {
      console.error(error);

    })
}
  