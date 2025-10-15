export default function CharacterCard({ name, onSelect }) {
    return (
      <div className="card" onClick={onSelect}>
        <h3>{name}</h3>
      </div>
    );
  }