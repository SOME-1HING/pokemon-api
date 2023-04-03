const express = require("express");
const fs = require("fs");
const stringSimilarity = require("string-similarity");

const app = express();

const pokemonNamesRaw = fs.readFileSync("pokemonNames.json");
const pokemonNames = JSON.parse(pokemonNamesRaw);

// Function to load data for a specific Pokemon ID
function loadPokemonData(id) {
  const filename = `./pokemons/${id}.json`;
  if (isNaN(id)) {
    return {
      error: "Invalid Pokemon ID.",
    };
  }
  try {
    const rawData = fs.readFileSync(filename);
    return JSON.parse(rawData)["poke"][0];
  } catch (error) {
    return {
      error: "Pokemon not found.",
    };
  }
}

// Route to handle the root endpoint
app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "Welcome to the Pokemon API. Use /pokemon endpoint to search for a Pokemon by name or ID. The Pokedex data used in this project is provided by PokeAPI (pokeapi.co)"
    );
});

// Route to handle the /pokemon endpoint
app.get("/pokemon", (req, res) => {
  const pName = req.query.name ? req.query.name : "";
  let pId = req.query.id ? req.query.id : "";

  // If no query parameters provided, return usage information
  if (!pName && !pId) {
    return res.status(400).json({
      error:
        "No query parameters provided. Usage: /pokemon?name={pokemon name} or /pokemon?id={pokemon id}",
    });
  }

  // Validate Pokemon ID if provided
  if (pId) {
    try {
      pId = parseInt(pId);
    } catch (error) {
      return res.status(400).json({ error: "Pokemon ID not a number." });
    }
    if (pId > 1010 || pId < 1) {
      return res
        .status(400)
        .json({ error: "Pokemon ID must be between 1 and 1010." });
    } else {
      const pokemon = loadPokemonData(pId);
      if (pokemon) {
        return res.status(200).json(pokemon);
      } else {
        return res.status(404).json({ error: "Pokemon not found." });
      }
    }
  }

  // Predict Pokemon name if not found in database
  if (pName) {
    const pred = predictPokemon(pName);
    if (pred === "Not found") {
      return res.status(404).json({ error: "Pokemon not found." });
    } else {
      const filename = `./pokemons/${pokemonNames.indexOf(pred) + 1}.json`;
      if (fs.existsSync(filename)) {
        const pokemon = loadPokemonData(pokemonNames.indexOf(pred) + 1);
        return res.status(200).json(pokemon);
      } else {
        return res.status(404).json({ error: "Pokemon not found." });
      }
    }
  }
});

// Function to predict Pokemon name
function predictPokemon(input) {
  input = input.replace("-", " "); // Replace dashes with spaces
  const matchingPokemon = pokemonNames.filter((name) => {
    const probability = stringSimilarity.compareTwoStrings(name, input);
    return probability >= 0.65;
  });
  if (matchingPokemon.length === 0) {
    return "Not found";
  } else {
    const maxProbabilityPokemon = matchingPokemon.reduce((prev, curr) => {
      const prevProbability = stringSimilarity.compareTwoStrings(prev, input);
      const currProbability = stringSimilarity.compareTwoStrings(curr, input);
      return currProbability > prevProbability ? curr : prev;
    });
    return maxProbabilityPokemon;
  }
}

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
