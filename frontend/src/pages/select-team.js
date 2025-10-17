import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SelectTeam() {
  const [team, setTeam] = useState([]);
  const router = useRouter();

  // Carrega time salvo do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedTeam");
    if (saved) setTeam(JSON.parse(saved));
  }, []);

  const handleStartBattle = () => {
    if (team.length === 0) return alert("Selecione pelo menos 1 Pokémon!");
    router.push("/battle");
  };

  return (
    <div className="select-team-container">
      <h1>⚔️ Sua Equipe Pokémon</h1>

      {team.length === 0 ? (
        <p>Nenhum Pokémon selecionado ainda.</p>
      ) : (
        <div className="pokemon-grid">
          {team.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      )}

      {team.length > 0 && (
        <button className="btn-start" onClick={handleStartBattle}>
          🚀 Iniciar Batalha
        </button>
      )}
    </div>
  );
}

// --- Componente de card do Pokémon ---
function PokemonCard({ pokemon }) {
  return (
    <div className="pokemon-card">
      <h3>{pokemon.name.toUpperCase()}</h3>
      <img src={pokemon.animated} alt={pokemon.name} width={100} height={100} />

      <div className="stats">
        <div className="stat"><strong>HP:</strong> {pokemon.hp}</div>
        <div className="stat"><strong>Ataque:</strong> {pokemon.attack}</div>
        <div className="stat"><strong>Defesa:</strong> {pokemon.defense}</div>
        <div className="stat"><strong>Velocidade:</strong> {pokemon.speed}</div>
      </div>

      {pokemon.moves && pokemon.moves.length > 0 && (
        <div className="moves">
          <strong>Golpes:</strong>
          <ul>
            {pokemon.moves.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
