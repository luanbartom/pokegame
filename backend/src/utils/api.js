import axios from "axios";

export const pokeAPI = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

export async function getPokemon(name) {
  try {
    const res = await pokeAPI.get(`pokemon/${name.toLowerCase()}`);
    return {
      name: res.data.name,
      sprite: res.data.sprites.front_default,
      hp: res.data.stats[0].base_stat,
      attack: res.data.stats[1].base_stat,
      defense: res.data.stats[2].base_stat,
      speed: res.data.stats[5].base_stat,
      type: res.data.types[0].type.name
    };
  } catch (err) {
    console.error("Erro ao buscar Pokémon:", err);
    return null;
  }
}
