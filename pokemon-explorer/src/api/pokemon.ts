import type { Pokemon } from '../types/pokemon';

type PokemonListResponse = {
  results: {
    name: string;
    url: string;
  }[];
};

export async function fetchPokemons(limit = 24, offset = 0): Promise<Pokemon[]> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch pokemon list');
  }

  const data: PokemonListResponse = await response.json();

  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon) => {
      const response = await fetch(pokemon.url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${pokemon.name}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map(
          (type: { type: { name: string } }) => type.type.name,
        ),
      };
    }),
  );

  return pokemonDetails;
}