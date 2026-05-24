import { useEffect, useState } from 'react';
import { fetchPokemons } from './api/pokemon';
import { PokemonCard } from './components/PokemonCard';
import type { Pokemon } from './types/pokemon';

const PAGE_SIZE = 24;

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function loadInitialPokemons() {
      try {
        const data = await fetchPokemons(PAGE_SIZE, 0);

        setPokemons(data);
      } catch (error) {
        console.error('Error while loading pokemons:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialPokemons();
  }, []);

  async function handleLoadMore() {
    try {
      setLoadingMore(true);

      const nextOffset = offset + PAGE_SIZE;
      const data = await fetchPokemons(PAGE_SIZE, nextOffset);

      setPokemons((currentPokemons) => [...currentPokemons, ...data]);
      setOffset(nextOffset);
    } catch (error) {
      console.error('Error while loading more pokemons:', error);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111111] px-6 py-8 text-white">
      <h1 className="mb-10 text-center text-4xl font-bold text-orange-500">
        Pokémon Explorer
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default App;