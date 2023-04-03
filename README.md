# Pokemon API

This API provides information on Pokemon. The data used in this project is provided by PokeAPI (pokeapi.co).

## Usage

Use the `/pokemon` endpoint to search for a Pokemon by name or ID.

### Search by name

To search for a Pokemon by name, send a GET request to `/pokemon` with the following query parameter:

- `name`: the name of the Pokemon you want to search for (e.g. `pikachu`)

If the Pokemon is found in the database, the API will return information about that Pokemon. If the Pokemon is not found in the database, the API will try to predict the correct name of the Pokemon based on the input query.

### Search by ID

To search for a Pokemon by ID, send a GET request to `/pokemon` with the following query parameter:

- `id`: the ID of the Pokemon you want to search for (e.g. `25` for Pikachu)

The Pokemon ID must be a number between 1 and 1010. If the Pokemon with the provided ID is found in the database, the API will return information about that Pokemon. If the Pokemon is not found in the database, the API will return a 404 error.

## Example

Here is an example of how to search for information about Pikachu:

```bash
GET https://pokemon.some-1hing.repl.co/pokemon?name=pikachu

GET https://pokemon.some-1hing.repl.co/pokemon?id=25
```

## License

This project is licensed under the GNU General Public License v3.0. You can view the license [here](https://github.com/username/repo/blob/master/LICENSE).
