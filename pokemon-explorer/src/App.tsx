import { useEffect, useState } from 'react';

type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch(
          'https://pokeapi.co/api/v2/pokemon?limit=24'
        );

        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { url: string }) => {
            const response = await fetch(pokemon.url);

            const data = await response.json();

            return {
              id: data.id,
              name: data.name,
              image: data.sprites.other['official-artwork'].front_default,
              types: data.types.map(
                (type: { type: { name: string } }) => type.type.name
              ),
            };
          })
        );

        setPokemons(pokemonDetails);
      } catch (error) {
        console.error('Error while fetching pokemons:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  return (
    <main className="min-h-screen bg-[#111111] px-6 py-8 text-white">
      <h1 className="mb-10 text-center text-4xl font-bold text-orange-500">
        Pokémon Explorer
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pokemons.map((pokemon) => (
            <div
              key={pokemon.name}
              className="rounded-2xl bg-zinc-800 p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="h-28 w-28 object-contain"
                />

                <h2 className="mt-2 text-xl font-bold capitalize">
                  {pokemon.name}
                </h2>

                <p className="text-zinc-400">
                  #{pokemon.id.toString().padStart(3, '0')}
                </p>

                <div className="mt-3 flex gap-2">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-white/20 px-3 py-1 text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;