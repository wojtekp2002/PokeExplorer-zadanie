import type { Pokemon } from '../types/pokemon';
import { getPokemonCardBackground } from '../utils/typeColors';

type PokemonCardProps = {
  pokemon: Pokemon;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <article
        className="rounded-2xl p-6 text-white shadow-lg transition-transform hover:scale-[1.02]"
        style={{
            background: getPokemonCardBackground(pokemon.types),
        }}
    >
      <div className="flex flex-col items-center">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="h-28 w-28 object-contain"
        />

        <h2 className="mt-2 text-xl font-bold capitalize">{pokemon.name}</h2>

        <p className="text-zinc-400">
          #{pokemon.id.toString().padStart(3, '0')}
        </p>

        <div className="mt-3 flex gap-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="rounded-full bg-black/20 px-3 py-1 text-sm capitalize backdrop-blur-sm"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}