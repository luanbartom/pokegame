import { useEffect, useState } from "react";
import { getFirstGenPokemons } from "../utils/api";
import { useRouter } from "next/router";

export default function SelectPokemon() {
  const [pokemons, setPokemons] = useState([]);
  const [selected, setSelected] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function loadPokemons() {
      const data = await getFirstGenPokemons();
      setPokemons(data);
    }
    loadPokemons();
  }, []);

  const toggleSelect = (pokemon) => {
    if (selected.find((p) => p.id === pokemon.id)) {
      setSelected(selected.filter((p) => p.id !== pokemon.id));
    } else if (selected.length < 3) {
      setSelected([...selected, pokemon]);
    }
  };

  const confirmTeam = () => {
    if (selected.length === 3) {
      localStorage.setItem("selectedTeam", JSON.stringify(selected));
      router.push("/select-team");
    } else {
      alert("Selecione exatamente 3 Pokémon!");
    }
  };

  return (
    <div className="pokemon-select-container">
      <h1>Selecione sua Equipe Pokémon</h1>
      <p>Escolha até 3 Pokémon para a batalha!</p>

      <div className="pokemon-grid">
        {pokemons.map((p) => (
          <div
            key={p.id}
            className={`pokemon-card ${
              selected.find((sel) => sel.id === p.id) ? "selected" : ""
            }`}
            onClick={() => toggleSelect(p)}
            onMouseEnter={(e) =>
              (e.currentTarget.querySelector("img").src = p.animated)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.querySelector("img").src = p.sprite)
            }
          >
            <img src={p.sprite} alt={p.name} />
            <h3>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>

            <div className="types">
              {p.types.map((type, i) => (
                <span key={i} className={`type ${type}`}>
                  {type}
                </span>
              ))}
            </div>

            <ul className="moves">
              {p.moves.map((move, i) => (
                <li key={i}>{move}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button className="confirm" onClick={confirmTeam}>
        Confirmar Equipe ({selected.length}/3)
      </button>
    </div>
  );
}
