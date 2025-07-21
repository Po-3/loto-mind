// AccessCounter.jsx
import { useEffect, useState } from "react";

export default function AccessCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetch("https://api.countapi.xyz/hit/kujitonari.net/LotoMind")
      .then(res => res.json())
      .then(data => setCount(data.value));
  }, []);

  return (
    <span style={{ fontSize: "1em", color: "#1767a7", marginLeft: 10 }}>
      アクセス：{count !== null ? count.toLocaleString() + "回" : "読み込み中..."}
    </span>
  );
}