import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerName, setTrainerName] = useState("");

  const trainers = [
    { id: 1, image: "/images/trainer1.png" },
    { id: 2, image: "/images/trainer2.png" },
    { id: 3, image: "/images/trainer3.png" },
    { id: 4, image: "/images/trainer4.png" },
  ];

  function handleContinue() {
    if (selectedTrainer && trainerName.trim() !== "") {
      router.push("/select-pokemon");
    }
  }

  return (
    <div className="container">
      <h1>Escolha seu Treinador</h1>

      <div className="trainer-grid">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className={`trainer-card ${
              selectedTrainer === trainer.id ? "selected" : ""
            }`}
            onClick={() => setSelectedTrainer(trainer.id)}
          >
            <img src={trainer.image} alt={`Treinador ${trainer.id}`} />
          </div>
        ))}
      </div>

      {selectedTrainer && (
        <div className="trainer-name">
          <input
            type="text"
            placeholder="Digite o nome do treinador"
            value={trainerName}
            onChange={(e) => setTrainerName(e.target.value)}
          />
        </div>
      )}

      <button
        onClick={handleContinue}
        className="btn"
        disabled={!selectedTrainer || trainerName.trim() === ""}
      >
        Selecionar Pokémon
      </button>
    </div>
  );
}
