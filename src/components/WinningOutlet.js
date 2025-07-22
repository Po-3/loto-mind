import { useEffect, useState } from 'react';

export default function WinningOutlet() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://po-3.github.io/winning_data_for_ranking.json")
      .then(res => res.json())
      .then(data => {
        // 「合計当選金額」順で上位5件だけ仮表示
        const sorted = [...data].sort((a, b) =>
          (b.ミニロト当選金額 + b.ロト6当選金額 + b.ロト7当選金額) -
          (a.ミニロト当選金額 + a.ロト6当選金額 + a.ロト7当選金額)
        );
        setShops(sorted.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>ランキング読込中...</div>;
  if (!shops.length) return <div>データがありません</div>;

  return (
    <div style={{ padding: '30px 0' }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '1.4em', marginBottom: 18 }}>
        総合高額当選 売場ランキング（仮表示）
      </h2>
      <ol>
        {shops.map((s, i) => (
          <li key={i} style={{ marginBottom: 13, fontSize: '1.11em' }}>
            <strong>{s.売場名}</strong>
            <span style={{ marginLeft: 10, color: '#be9000', fontWeight: 700 }}>
              {(s.ミニロト当選金額 + s.ロト6当選金額 + s.ロト7当選金額).toLocaleString()}円
            </span>
            <span style={{ marginLeft: 14, color: '#888' }}>{s.都道府県名}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}