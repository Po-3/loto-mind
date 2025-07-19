import { useEffect, useState } from 'react';

// ロト種別→記事URLパターン生成
function getPredictionUrl(lotoType, drawNo) {
  // minilotoだけ表記に注意
  const prefix = lotoType === 'miniloto' ? 'miniloto' : lotoType;
  return `https://www.kujitonari.net/entry/${prefix}-${drawNo}-prediction-tonari`;
}

// drawNoはpropsやグローバルで取得（最新回番号を自動で割り出す仕組み推奨）
export default function Prediction({ lotoType, drawNo }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lotoType || !drawNo) return;
    const url = getPredictionUrl(lotoType, drawNo);
    // RSS/Feed/API推奨。下はCORS制限のある直接fetch例
    fetch(url)
      .then(res => res.text())
      .then(html => {
        // HTML本文から「最初の<table>」を抜き出してパース
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const table = doc.querySelector('table');
        if (!table) {
          setRows([]);
          setLoading(false);
          return;
        }
        const trs = table.querySelectorAll('tbody tr');
        const arr = [];
        trs.forEach(tr => {
          const tds = Array.from(tr.children);
          arr.push({
            type: tds[0]?.textContent.trim(),
            nums: tds[1]?.textContent.trim(),
            axis: tds[2]?.textContent.replace(/[^\d]/g, ''), // <strong>を除去
            feature: tds[3]?.textContent.trim()
          });
        });
        setRows(arr);
        setLoading(false);
      })
      .catch(() => {
        setRows([]);
        setLoading(false);
      });
  }, [lotoType, drawNo]);

  if (loading) return <div>読み込み中…</div>;
  if (!rows.length) return <div>ズバリ予想が取得できませんでした。</div>;

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '1.10em', margin: '8px 0' }}>となりのズバリ予想</h2>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{
          width: '100%',
          minWidth: 440,
          borderCollapse: 'collapse',
          marginTop: 8,
          marginBottom: 8,
          background: '#fff'
        }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #bbb', padding: 4, background: '#f4f8fd' }}>タイプ</th>
              <th style={{ border: '1px solid #bbb', padding: 4, background: '#f4f8fd' }}>予想数字</th>
              <th style={{ border: '1px solid #bbb', padding: 4, background: '#f4f8fd' }}>軸数字</th>
              <th style={{ border: '1px solid #bbb', padding: 4, background: '#f4f8fd' }}>特徴と狙い</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #ddd', padding: 4 }}>{row.type}</td>
                <td style={{ border: '1px solid #ddd', padding: 4 }}>{row.nums}</td>
                <td style={{ border: '1px solid #ddd', padding: 4, fontWeight: 700 }}>{row.axis}</td>
                <td style={{ border: '1px solid #ddd', padding: 4 }}>{row.feature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}