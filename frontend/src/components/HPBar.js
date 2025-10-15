export default function HPBar({ hp, maxHp, color }) {
    const percent = (hp / maxHp) * 100;
    return (
      <div className="hp-bar">
        <div className="hp" style={{ width: `${percent}%`, backgroundColor: color }}></div>
      </div>
    );
  }