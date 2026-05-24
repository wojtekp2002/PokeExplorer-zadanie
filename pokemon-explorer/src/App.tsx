import { useEffect, useState } from 'react';
import { fetchPokemons } from './api/pokemon';
import { PokemonCard } from './components/PokemonCard';
import type { Pokemon } from './types/pokemon';
import { pokemonTypes } from './constants/pokemonTypes';
import { typeColors } from './utils/typeColors';


const PAGE_SIZE = 24;

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

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

  function toggleType(type: string) {
    setSelectedTypes((currentTypes) => {
      if (currentTypes.includes(type)) {
        return currentTypes.filter(
          (currentType) => currentType !== type,
        );
      }

      return [...currentTypes, type];
    });
  }

  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesTypes =
      selectedTypes.length === 0 ||
      selectedTypes.every((selectedType) =>
        pokemon.types.includes(selectedType),
      );

    return matchesSearch && matchesTypes;
  });

  return (
    <main className="min-h-screen bg-[#111111] px-6 py-8 text-white">
      <h1 className="mb-10 text-center text-4xl font-bold text-orange-500">
        Pokémon Explorer
      </h1>

      <div className="mx-auto mb-6 max-w-xl">
        <input
          type="text"
          placeholder="Search pokemon..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-white outline-none transition focus:border-orange-500"
        />
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {pokemonTypes.map((type) => {
          const isSelected = selectedTypes.includes(type);

          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize text-white transition ${
                isSelected
                  ? 'ring-2 ring-white'
                  : ''
              }`}
              style={{
                backgroundColor: typeColors[type],
              }}
            >
              {type}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPokemons.map((pokemon) => (
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