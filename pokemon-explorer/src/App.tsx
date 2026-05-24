import { useEffect, useState } from 'react';
import { fetchPokemons } from './api/pokemon';
import { PokemonCard } from './components/PokemonCard';
import type { Pokemon } from './types/pokemon';
import { pokemonTypes } from './constants/pokemonTypes';
import { typeColors } from './utils/typeColors';


const PAGE_SIZE = 24;
const POKEBALL_IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

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

  function clearFilters() {
    setSearch('');
    setSelectedTypes([]);
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
      <header className="mb-8 flex flex-col items-center">
        <div className="mb-6 flex items-center gap-3">
          <img
            src={POKEBALL_IMAGE_URL}
            alt=""
            aria-hidden="true"
            className="h-8 w-8"
          />

          <h1 className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-300 bg-clip-text text-center text-4xl font-extrabold text-transparent md:text-4xl">
            Pokémon Explorer
          </h1>
        </div>

        <div className="w-full max-w-xl">
          <input
            type="text"
            placeholder="Search pokemon..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-white outline-none transition placeholder:text-zinc-400 focus:border-orange-500"
          />
        </div>
      </header>

      <div className="mx-auto mb-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
        {pokemonTypes.map((type) => {
          const isSelected = selectedTypes.includes(type);

          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-bold capitalize text-white transition hover:scale-105 ${
                isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111111]' : ''
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
          {filteredPokemons.length === 0 ? (
            <section className="mx-auto mt-16 max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center">
              <h2 className="text-2xl font-bold text-white">No Pokémon found</h2>

              <p className="mt-3 text-zinc-400">
                Try changing your search phrase or selected type filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-orange-500 px-5 py-2 font-semibold text-white transition hover:bg-orange-600"
              >
                Clear filters
              </button>
            </section>
          ) : (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          )}

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