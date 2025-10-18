import { useState, useEffect } from "react";
import HPBar from "@/components/HPBar";
import ConditionBar from "@/components/ConditionBar";
import { getPokemon } from "@/services/api";

export default function Battle() {
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [log, setLog] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const savedTeam = localStorage.getItem("selectedTeam");
    if (savedTeam) {
      const parsed = JSON.parse(savedTeam);
      setTeam(parsed);
      if (parsed.length > 0) startBattle(parsed[0]);
    } else {
      setError("Nenhum time encontrado! Volte e selecione seus Pokémon.");
    }
  }, []);

  async function startBattle(selectedPokemon = null) {
    setLoading(true);
    setError(null);

    const player = selectedPokemon || {
      id: 25,
      name: "Pikachu",
      hp: 100,
      condition: "normal",
      moves: ["tackle", "thunder-shock", "quick-attack", "tail-whip"],
      animated:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif",
    };

    try {
      const enemyId = Math.floor(Math.random() * 151) + 1;
      const enemyData = await getPokemon(enemyId);
      const enemy = { ...enemyData, hp: enemyData.hp, condition: "normal" };
      setBattle({ player, enemy, currentTurn: "player", winner: null });
      setLog(["⚔️ Batalha iniciada!"]);
    } catch (err) {
      const enemy = {
        id: 1,
        name: "Bulbasaur",
        hp: 100,
        moves: ["tackle", "vine-whip", "growl", "leech-seed"],
        animated:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif",
        condition: "normal",
      };
      setBattle({ player, enemy, currentTurn: "player", winner: null });
      setLog(["⚔️ Batalha simulada iniciada!"]);
    } finally {
      setLoading(false);
    }
  }

  function handleMove(move) {
    if (!battle || battle.winner || battle.currentTurn !== "player") return;

    const playerAttack = Math.floor(Math.random() * 20) + 5;
    const enemyAttack = Math.floor(Math.random() * 15) + 5;
    const newBattle = { ...battle };
    const newLog = [...log];

    newBattle.enemy.hp = Math.max(newBattle.enemy.hp - playerAttack, 0);
    newLog.unshift(
      `⚡ ${newBattle.player.name} usou ${move}! Causou ${playerAttack} de dano!`
    );

    if (newBattle.enemy.hp <= 0) {
      newBattle.winner = "player";
      newLog.unshift(`🎉 ${newBattle.player.name} venceu a batalha!`);
      setBattle(newBattle);
      setLog(newLog);
      return;
    }

    newBattle.currentTurn = "enemy";
    setBattle(newBattle);
    setLog(newLog);

    setTimeout(() => {
      const enemyMove =
        newBattle.enemy.moves[
          Math.floor(Math.random() * newBattle.enemy.moves.length)
        ];
      newBattle.player.hp = Math.max(newBattle.player.hp - enemyAttack, 0);
      newLog.unshift(
        `🌿 ${newBattle.enemy.name} usou ${enemyMove}! Causou ${enemyAttack} de dano!`
      );

      if (newBattle.player.hp <= 0) {
        newBattle.winner = "enemy";
        newLog.unshift(`💀 ${newBattle.enemy.name} venceu a batalha!`);
      }

      newBattle.currentTurn = "player";
      setBattle({ ...newBattle });
      setLog([...newLog]);
    }, 1000);
  }

  function handleSwitch(index) {
    if (index === currentIndex || !team[index]) return;
    setCurrentIndex(index);
    startBattle(team[index]);
    setLog((prev) => [`🔄 Você trocou para ${team[index].name}`, ...prev]);
  }

  if (loading && !battle) return <p>Carregando batalha...</p>;
  if (error)
    return (
      <div className="container">
        <p>{error}</p>
        <button onClick={() => startBattle(team[currentIndex])}>🔁 Tentar novamente</button>
      </div>
    );
  if (!battle) return null;

  const { player, enemy, winner, currentTurn } = battle;

  return (
    <div className="battle-container">
      {/* Inimigo */}
      <div className="enemy-section">
        <HPBar hp={enemy.hp} maxHp={enemy.hp} color="red" />
        <ConditionBar condition={enemy.condition} />
        <img src={enemy.animated} alt={enemy.name} className="sprite" />
        <p>{enemy.name}</p>
      </div>

      {/* Log */}
      <div className="battle-log">
        <h4>Relatório de batalha:</h4>
        <ul>
          {log.map((entry, idx) => (
            <li key={idx}>{entry}</li>
          ))}
        </ul>
      </div>

      {/* Jogador */}
      <div className="player-section">
        <HPBar hp={player.hp} maxHp={player.hp} color="green" />
        <ConditionBar condition={player.condition} />
        <img src={player.animated} alt={player.name} className="sprite" />
        <p>{player.name}</p>

        {!winner && currentTurn === "player" && (
          <div className="moves">
            {player.moves.map((move, idx) => (
              <button key={idx} onClick={() => handleMove(move)}>
                {move}
              </button>
            ))}
          </div>
        )}

        <div className="switch-team">
          {team.map((p, idx) => (
            <button key={idx} onClick={() => handleSwitch(idx)}>
              {p.name}
            </button>
          ))}
        </div>

        {winner && (
          <div className="winner">
            <h3>{winner === "player" ? "🎉 Você venceu!" : "💀 Você perdeu!"}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
