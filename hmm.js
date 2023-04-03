const fs = require("fs");

// Read the contents of pokedex.json
const pokedex = require("./pokedex.json");

// Loop through each Pokemon in the pokedex
pokedex.poke.forEach((pokemon, index) => {
  // Create a new object with only the current Pokemon's data
  const pokemonData = { poke: [pokemon] };
  // Convert the object to JSON format
  const pokemonDataJson = JSON.stringify(pokemonData);
  // Write the JSON data to a new file with the Pokemon's ID as the filename
  fs.writeFile(`pokemons/${index + 1}.json`, pokemonDataJson, (err) => {
    if (err) throw err;
    console.log(`File ${index + 1}.json has been created!`);
  });
});
