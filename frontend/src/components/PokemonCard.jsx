import "../app/globals.css";

export default function PokemonCard({ pokemon }) {
  if (!pokemon) return null;

  return (
    <div className="pokemon-card">
      <img src={pokemon.sprite} alt={pokemon.name} className="sprite" />
      <h2 className="name">{pokemon.name}</h2>
      <p>HP: {pokemon.hp}</p>
      <p>Tipo: {pokemon.type}</p>
    </div>
  );
}
