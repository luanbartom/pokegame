export default function ConditionBar({ condition }) {
    if (!condition) return null;
  
    const colors = {
      poisoned: "#9b30ff",
      paralyzed: "#ffcc00",
      asleep: "#66ccff",
      burned: "#ff3300",
      frozen: "#a6e0ff",
    };
  
    const labels = {
      poisoned: "Envenenado",
      paralyzed: "Paralisado",
      asleep: "Dormindo",
      burned: "Queimado",
      frozen: "Congelado",
    };
  
    const color = colors[condition] || "#aaa";
    const text = labels[condition] || "OK";
  
    return (
      <div className="condition-bar" style={{ backgroundColor: color }}>
        {text}
      </div>
    );
  }