import { useState, useEffect } from "react";
import HPBar from "@/components/HPBar";
import ConditionBar from "@/components/ConditionBar";
import api from "@/services/api";

export default function Battle() {
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [log, setLog] = useState([]);

  // Inicia a batalha automaticamente
  useEffect(() => {
    startBattle();
  }, []);

  // === Função para iniciar a batalha ===
  async function startBattle() {
    setLoading(true);
    setError(null);

    // Pokémons fixos por enquanto
    const player = {
      id: 25,
      name: "pikachu",
      type: "electric",
      hp: 100,
      condition: "normal",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      animated: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif",
    };

    const enemy = {
      id: 1,
      name: "bulbasaur",
      type: "grass",
      hp: 100,
      condition: "normal",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      animated: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif",
    };

    try {
      // 🔹 tenta chamar o backend
      const response = await api.post("/battle/start", { player, enemy });
      setBattle(response.data.battle);
      setLog(response.data.battle.log || []);
    } catch (err) {
      console.warn("Servidor não respondeu. Usando simulação local.");
      // 🔸 simula a batalha localmente se o backend não estiver ativo
      setBattle({ player, enemy, currentTurn: "player", winner: null });
      setLog(["Batalha simulada iniciada (modo offline)."]);
    } finally {
      setLoading(false);
    }
  }

  // === Função para realizar o ataque ===
  async function handleAttack() {
    if (!battle || battle.winner) return;
    setLoading(true);

    try {
      // 🔹 tenta processar o turno via backend
      const response = await api.post("/battle/turn");
      setBattle(response.data.battle);
      setLog(response.data.battle.log || []);
    } catch (err) {
      // 🔸 simulação local se o backend não responder
      const playerAttack = Math.floor(Math.random() * 20) + 5;
      const enemyAttack = Math.floor(Math.random() * 15) + 5;
      let newBattle = { ...battle };
      let newLog = [...log];

      if (newBattle.currentTurn === "player") {
        newBattle.enemy.hp = Math.max(newBattle.enemy.hp - playerAttack, 0);
        newLog.unshift(`⚡ Pikachu causou ${playerAttack} de dano!`);

        if (newBattle.enemy.hp <= 0) {
          newBattle.winner = "player";
          newLog.unshift("🎉 Pikachu venceu a batalha!");
        } else {
          newBattle.currentTurn = "enemy";
          setTimeout(() => {
            newBattle.player.hp = Math.max(newBattle.player.hp - enemyAttack, 0);
            newLog.unshift(`🌿 Bulbasaur causou ${enemyAttack} de dano!`);

            if (newBattle.player.hp <= 0) {
              newBattle.winner = "enemy";
              newLog.unshift("💀 Bulbasaur venceu a batalha!");
            }

            newBattle.currentTurn = "player";
            setBattle({ ...newBattle });
            setLog([...newLog]);
          }, 1000);
        }
      }

      setBattle({ ...newBattle });
      setLog([...newLog]);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !battle) return <p>Carregando batalha...</p>;
  if (error)
    return (
      <div className="container">
        <p>{error}</p>
        <button className="btn" onClick={startBattle}>
          🔁 Tentar novamente
        </button>
      </div>
    );
  if (!battle) return null;

  const { player, enemy, winner, currentTurn } = battle;

  return (
    <div className="container">
      <h2>Batalha Pokémon!</h2>

      {winner && (
        <div className="winner">
          <h3>{winner === "player" ? "🎉 Você venceu!" : "💀 Você perdeu!"}</h3>
          <img
            src={winner === "player" ? player.animated : enemy.animated}
            alt="Vencedor"
            className="sprite"
          />
        </div>
      )}

      <div className="battlefield">
        {/* Inimigo */}
        <div className="pokemon-field">
          <h3>Oponente: {enemy.name}</h3>
          <img
            src={enemy.animated}
            alt={enemy.name}
            className="sprite"
          />
          <HPBar hp={enemy.hp} maxHp={100} color="red" />
          <ConditionBar condition={enemy.condition} />
          <p>HP: {enemy.hp}/100</p>
        </div>

        {/* Jogador */}
        <div className="pokemon-field">
          <h3>Você: {player.name}</h3>
          <img
            src={player.animated}
            alt={player.name}
            className="sprite"
          />
          <HPBar hp={player.hp} maxHp={100} color="green" />
          <ConditionBar condition={player.condition} />
          <p>HP: {player.hp}/100</p>
        </div>
      </div>

      {/* Controles */}
      {!winner && (
        <div className="controls">
          <p>
            <strong>Turno atual:</strong>{" "}
            {currentTurn === "player" ? "Sua vez!" : "Vez do inimigo..."}
          </p>

          <button
            className="btn"
            onClick={handleAttack}
            disabled={currentTurn !== "player" || loading}
          >
            ⚡ Atacar
          </button>

          <button className="btn" onClick={startBattle}>
            🔁 Reiniciar
          </button>
        </div>
      )}

      {/* Log da batalha */}
      <div className="log">
        <h4>Registro da batalha:</h4>
        <ul>
          {log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
