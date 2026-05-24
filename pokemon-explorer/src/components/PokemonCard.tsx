import type { Pokemon } from '../types/pokemon';
import { getPokemonCardBackground } from '../utils/typeColors';

type PokemonCardProps = {
  pokemon: Pokemon;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <article
      className="min-h-[210px] rounded-2xl p-5 text-white shadow-lg transition-transform hover:scale-[1.02]"
      style={{
        background: getPokemonCardBackground(pokemon.types),
      }}
    >
      <div className="flex h-full flex-col items-center justify-center">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="h-24 w-24 object-contain"
        />

        <h2 className="mt-2 text-2xl font-extrabold capitalize leading-tight">
          {pokemon.name}
        </h2>

        <p className="mt-1 text-base font-semibold text-white/85">
          #{pokemon.id.toString().padStart(3, '0')}
        </p>

        <div className="mt-4 flex gap-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="rounded-full bg-white/30 px-3 py-1 text-sm font-bold capitalize text-white shadow-sm"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}