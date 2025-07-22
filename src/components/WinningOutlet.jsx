import React, { useEffect, useState } from 'react';

// 見出し色
const labelColors = {
  "ミニロト": "#f39800",
  "ロト6": "#167bda",
  "ロト7": "#b00584",
  "総合": "#a05a17"
};

function SectionTitle({ children, color }) {
  return (
    <h2 style={{
      fontWeight: 'bold',
      fontSize: '1.25em',
      margin: '38px 0 14px 0',
      borderBottom: `3px solid ${color}`,
      letterSpacing: 0.01
    }}>{children}</h2>
  );
}

// 最新高額当選リスト
function LatestList({ label, color, details }) {
  return (
    <div>
      <SectionTitle color={color}>{label} 最新高額当選情報</SectionTitle>
      {details.length === 0 ? (
        <div style={{ color: '#999', margin: '10px 0 24px 0' }}>データがありません</div>
      ) : (
        details.map((item, i) => (
          <div key={i} style={{
            marginBottom: 20,
            background: '#fffdfa',
            borderRadius: 14,
            border: `2px solid ${color}`,
            boxShadow: `0 1px 8px ${color}14`,
            padding: 14
          }}>
            <div style={{ fontWeight: 700, color }}>{item.売場名}</div>
            <div style={{ fontSize: '0.96em', color: '#888' }}>{item.都道府県名}</div>
            <div style={{ marginTop: 6 }}>
              <span style={{ color: '#222', fontWeight: 700 }}>開催回: </span>
              {item.latestKai}
              <span style={{ color: '#af8500', marginLeft: 10 }}>{item.latestGrade}</span>
            </div>
            <div style={{ marginTop: 4, fontWeight: 700, color }}>
              {Number(item.latestAmount).toLocaleString()}円
            </div>
            {item.詳細URL &&
              <a href={item.詳細URL} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.95em', color, textDecoration: 'underline' }}>
                詳細リンク
              </a>
            }
          </div>
        ))
      )}
    </div>
  );
}

// ランキング表示
function RankingList({ label, color, entries, field }) {
  return (
    <div>
      <SectionTitle color={color}>{label} 売場ランキング（第5位まで）</SectionTitle>
      {entries.length === 0 ? (
        <div style={{ color: '#999', margin: '10px 0 24px 0' }}>データがありません</div>
      ) : (
        entries.map((entry, i) => (
          <div key={i} style={{
            marginBottom: 20,
            background: '#f8fafd',
            borderRadius: 14,
            border: `2px solid ${color}`,
            boxShadow: `0 1px 8px ${color}14`,
            padding: 14
          }}>
            <span style={{
              background: color, color: '#fff', fontWeight: 700, borderRadius: 12,
              padding: '3px 16px', marginRight: 12, fontSize: '1.05em'
            }}>第{i + 1}位</span>
            <span style={{ fontWeight: 700, fontSize: '1.08em', color }}>{entry.売場名}</span>
            <span style={{ color: '#888', marginLeft: 10 }}>{entry.都道府県名}</span>
            <div style={{ marginTop: 5 }}>
              <span style={{ color: '#555' }}>当選金額：</span>
              <span style={{ fontWeight: 700, color }}>
                {Number(entry[field]).toLocaleString()}円
              </span>
            </div>
            {entry.詳細URL &&
              <div>
                <a href={entry.詳細URL} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.93em', color, textDecoration: 'underline' }}>
                  詳細リンク
                </a>
              </div>
            }
          </div>
        ))
      )}
    </div>
  );
}

export default function WinningOutlet() {
  const [loading, setLoading] = useState(true);
  const [latest, setLatest] = useState({ miniloto: [], loto6: [], loto7: [] });
  const [ranking, setRanking] = useState({ total: [], miniloto: [], loto6: [], loto7: [] });

  useEffect(() => {
    fetch('https://po-3.github.io/winning_data_for_ranking.json')
      .then(res => res.json())
      .then(data => {
        // 最新高額当選（各くじ7件まで）
        const latestByType = (type, detailKey) => data
          .filter(e => Array.isArray(e[detailKey]) && e[detailKey].length > 0)
          .map(e => ({
            ...e,
            latestKai: e[detailKey][0]?.回号 || "",
            latestAmount: e[detailKey][0]?.金額 || "",
            latestGrade: e[detailKey][0]?.等級 || "",
          }))
          .filter(e => e.latestKai && e.latestAmount)
          .sort((a, b) => Number((b.latestKai || '').replace(/[^\d]/g, '')) -
                          Number((a.latestKai || '').replace(/[^\d]/g, '')))
          .slice(0, 7);

        // 集計（合計・くじ別）
        const sum = arr => Array.isArray(arr) ? arr.reduce((a, d) => a + (+d.金額 || 0), 0) : 0;
        const norm = e => ({
          ...e,
          ミニロト当選金額: sum(e.ミニロト当選詳細),
          ロト6当選金額: sum(e.ロト6当選詳細),
          ロト7当選金額: sum(e.ロト7当選詳細),
          合計当選金額: sum(e.ミニロト当選詳細) + sum(e.ロト6当選詳細) + sum(e.ロト7当選詳細)
        });
        const normalized = data.map(norm);

        setLatest({
          miniloto: latestByType('ミニロト', 'ミニロト当選詳細'),
          loto6: latestByType('ロト6', 'ロト6当選詳細'),
          loto7: latestByType('ロト7', 'ロト7当選詳細')
        });
        setRanking({
          total: [...normalized].sort((a, b) => b.合計当選金額 - a.合計当選金額).slice(0, 5),
          loto6: normalized.filter(e => e.ロト6当選金額 > 0).sort((a, b) => b.ロト6当選金額 - a.ロト6当選金額).slice(0, 5),
          loto7: normalized.filter(e => e.ロト7当選金額 > 0).sort((a, b) => b.ロト7当選金額 - a.ロト7当選金額).slice(0, 5),
          miniloto: normalized.filter(e => e.ミニロト当選金額 > 0).sort((a, b) => b.ミニロト当選金額 - a.ミニロト当選金額).slice(0, 5),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>読込中...</div>;

  return (
    <div style={{ padding: '8px 0 34px 0', maxWidth: 620, margin: '0 auto' }}>
      <LatestList label="ミニロト" color={labelColors['ミニロト']} details={latest.miniloto} />
      <LatestList label="ロト6" color={labelColors['ロト6']} details={latest.loto6} />
      <LatestList label="ロト7" color={labelColors['ロト7']} details={latest.loto7} />

      <RankingList label="総合高額当選" color={labelColors['総合']} entries={ranking.total} field="合計当選金額" />
      <RankingList label="ロト6 高額当選" color={labelColors['ロト6']} entries={ranking.loto6} field="ロト6当選金額" />
      <RankingList label="ロト7 高額当選" color={labelColors['ロト7']} entries={ranking.loto7} field="ロト7当選金額" />
      <RankingList label="ミニロト 高額当選" color={labelColors['ミニロト']} entries={ranking.miniloto} field="ミニロト当選金額" />
    </div>
  );
}