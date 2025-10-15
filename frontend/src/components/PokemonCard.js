export default function PokemonCard({ pokemon, selected, onSelect, hovered, setHovered }) {
  return (
    <div
      className={`card ${selected ? "selected" : ""}`}
      onClick={onSelect}
      onMouseEnter={() => setHovered(pokemon.id)}
      onMouseLeave={() => setHovered(null)}
    >
      <img
        src={hovered === pokemon.id ? pokemon.animated : pokemon.image}
        alt={pokemon.name}
        className="poke-img"
      />
      <h3>{pokemon.name}</h3>
    </div>
  );
}
