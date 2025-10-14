import BattleArena from "@/components/BattleArena";
import "./globals.css";

export default function Home() {
  return (
    <main className="container">
      <h1 className="title">⚔️ Pokémon Battle Arena</h1>
      <BattleArena />
    </main>
  );
}
