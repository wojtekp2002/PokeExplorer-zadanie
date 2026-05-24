import { useEffect, useState } from 'react';
import { fetchPokemons } from './api/pokemon';
import { PokemonCard } from './components/PokemonCard';
import type { Pokemon } from './types/pokemon';

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPokemons() {
      try {
        const data = await fetchPokemons();

        setPokemons(data);
      } catch (error) {
        console.error('Error while loading pokemons:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPokemons();
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
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </main>
  );
}

export default App;