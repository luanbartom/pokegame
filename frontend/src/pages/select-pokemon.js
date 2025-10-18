import { useEffect, useState } from "react";
import { getFirstGenPokemons } from "../utils/api";
import { useRouter } from "next/router";
import styles from "../styles/SelectPokemon.module.css";

export default function SelectPokemon() {
  const [pokemons, setPokemons] = useState([]);
  const [selected, setSelected] = useState([]);
  const [trainerName, setTrainerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [evolutionStage, setEvolutionStage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("trainerName") || "Treinador";
    setTrainerName(name);

    async function loadPokemons() {
      const data = await getFirstGenPokemons();
      setPokemons(data);
    }
    loadPokemons();
  }, []);

  const toggleSelect = (pokemon) => {
    if (selected.includes(pokemon)) {
      setSelected(selected.filter((p) => p !== pokemon));
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
    <div className={styles.container}>
      {/* Barra flutuante */}
      <div className={styles.trainerBar}>
        <span className={styles.trainerName}>
          <img
            className={styles.trainerIcon}
            src="/trainerIcon.png"
            alt="Trainer Icon"
          />
          {trainerName}
        </span>

        <div className={styles.pokeballs}>
          {[...Array(3)].map((_, index) => (
            <img
              key={index}
              className={
                index < selected.length ? styles.filled : styles.empty
              }
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokeball"
            />
          ))}
        </div>

        <button
          className={styles.confirmBar}
          onClick={confirmTeam}
          disabled={selected.length < 3}
        >
          Confirmar ({selected.length}/3)
        </button>
      </div>

      <h1 className={styles.title}>Selecione sua Equipe Pokémon</h1>
      <p className={styles.subtitle}>Escolha até 3 Pokémon para a batalha!</p>

      {/* 🔍 Filtros de busca e seleção */}
      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className={styles.searchInput}
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className={styles.select}
        >
          <option value="">Todos os tipos</option>
          {[
            "normal",
            "fire",
            "water",
            "grass",
            "electric",
            "ice",
            "fighting",
            "poison",
            "ground",
            "flying",
            "psychic",
            "bug",
            "rock",
            "ghost",
            "dragon",
            "dark",
            "steel",
            "fairy",
          ].map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* 🧩 Grid de Pokémons filtrados */}
      <div className={styles.pokemonGrid}>
        {pokemons
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchTerm) && // busca
              (selectedType ? p.types.includes(selectedType) : true) && // tipo
              (evolutionStage
                ? p.evolutionStage === parseInt(evolutionStage)
                : true) // estágio
          )
          .map((p) => (
            <div
              key={p.id}
              className={`${styles.pokemonCard} ${
                selected.includes(p) ? styles.selected : ""
              }`}
              onClick={() => toggleSelect(p)}
              onMouseEnter={(e) =>
                (e.currentTarget.querySelector("img").src = p.animated)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.querySelector("img").src = p.sprite)
              }
            >
              <img
                className={styles.pokemonImg}
                src={p.sprite}
                alt={p.name}
              />
              <h3 className={styles.pokemonName}>
                {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
              </h3>

              <div className={styles.types}>
                {p.types.map((type, i) => (
                  <span key={i} className={`${styles.type} ${styles[type]}`}>
                    {type}
                  </span>
                ))}
              </div>
              <h3 className={styles.golpes}>Golpes</h3>

              <ul className={styles.moves}>
                {p.moves.map((move, i) => (
                  <li key={i}>{move}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}
