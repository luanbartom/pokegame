import axios from "axios";

export const pokeAPI = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

export async function getPokemon(nameOrId) {
  try {
    const res = await pokeAPI.get(`pokemon/${nameOrId.toLowerCase()}`);
    const stats = res.data.stats;
    const id = res.data.id;

    // Extrair apenas os 4 primeiros ataques
    const moves = res.data.moves.slice(0, 4).map((m) => m.move.name);

    return {
      id,
      name: res.data.name,
      sprite: res.data.sprites.front_default,
      animated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`,
      hp: stats[0].base_stat,
      attack: stats[1].base_stat,
      defense: stats[2].base_stat,
      speed: stats[5].base_stat,
      types: res.data.types.map((t) => t.type.name),
      moves, // 🔥 adiciona os ataques
    };
  } catch (err) {
    console.error("Erro ao buscar Pokémon:", err);
    return null;
  }
}

export async function getFirstGenPokemons() {
  try {
    const res = await pokeAPI.get("pokemon?limit=151");
    const pokemonList = res.data.results;

    const detailedPokemons = await Promise.all(
      pokemonList.map(async (p) => {
        return await getPokemon(p.name);
      })
    );

    return detailedPokemons.filter(Boolean);
  } catch (err) {
    console.error("Erro ao buscar lista de Pokémons:", err);
    return [];
  }
}