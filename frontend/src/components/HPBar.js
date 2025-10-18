import { useEffect, useState } from "react";

export default function HPBar({ hp, maxHp, color }) {
  const [currentHp, setCurrentHp] = useState(hp);

  useEffect(() => {
    setCurrentHp(hp);
  }, [hp]);

  const hpPercent = (currentHp / maxHp) * 100;

  return (
    <div className="hpbar-container">
      <div
        className="hpbar-fill"
        style={{
          width: `${hpPercent}%`,
          backgroundColor: color,
          transition: "width 0.5s ease-in-out",
        }}
      ></div>
    </div>
  );
}
