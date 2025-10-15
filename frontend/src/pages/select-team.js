import { useState, useEffect } from "react";
import PokemonCard from "@/components/PokemonCard.js";
import api from "@/Services/api";
import { useRouter } from "next/router";

export default function SelectTeam() {
  const [pokemons, setPokemons] = useState([]);
  const [selected, setSelected] = useState([]);
  const [hovered, setHovered] = useState(null);
  const router = useRouter();

  // 🔹 Simulação temporária até o backend estar pronto
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: "Pikachu",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        animated:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif",
      },
      {
        id: 2,
        name: "Charmander",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        animated:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif",
      },
      {
        id: 3,
        name: "Bulbasaur",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        animated:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif",
      },
      {
        id: 4,
        name: "Squirtle",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
        animated:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif",
      },
      {
        id: 5,
        name: "Eevee",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
        animated:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif",
      },
      {
        id: 6,
        name: "Gengar",
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
        animated:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif",
      },
    ];
    setPokemons(mockData);
  }, []);

  // 🔹 Alternar seleção de Pokémon
  function toggleSelect(pokemon) {
    if (selected.find((p) => p.id === pokemon.id)) {
      setSelected(selected.filter((p) => p.id !== pokemon.id));
    } else if (selected.length < 3) {
      setSelected([...selected, pokemon]);
    }
  }

  // 🔹 Ir para tela de batalha
  function handleConfirm() {
    if (selected.length === 0) {
      alert("Escolha pelo menos um Pokémon!");
      return;
    }
    localStorage.setItem("selectedTeam", JSON.stringify(selected));
    router.push("/battle");
  }

  return (
    <div className="container">
      <h1>Selecione sua Equipe Pokémon</h1>
      <p>Escolha até 3 Pokémon para a batalha!</p>

      <div className="grid">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            selected={selected.some((p) => p.id === pokemon.id)}
            onSelect={() => toggleSelect(pokemon)}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <button className="btn" onClick={handleConfirm}>
          Confirmar Equipe ({selected.length}/3)
        </button>
      </div>
    </div>
  );
}
