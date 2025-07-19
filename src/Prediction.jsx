import { useEffect, useState } from 'react';

// URLパターン生成
function getPredictionUrl(lotoType, drawNo) {
  const prefix = lotoType === 'miniloto' ? 'miniloto' : lotoType;
  return `https://www.kujitonari.net/entry/${prefix}-${drawNo}-prediction-tonari`;
}

export default function Prediction({ lotoType, drawNo }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lotoType || !drawNo) return;
    const url = getPredictionUrl(lotoType, drawNo);
    fetch(url)
      .then(res => res.text())
      .then(html => {
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
            axis: tds[2]?.textContent.replace(/[^\d]/g, ''),
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

  if (loading) return <div style={outerStyle}>読み込み中…</div>;
  if (!rows.length) return <div style={outerStyle}>ズバリ予想が取得できませんでした。</div>;

  return (
    <div style={outerStyle}>
      <h2 style={titleStyle}>となりのズバリ予想</h2>
      <div style={scrollStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>タイプ</th>
              <th style={thStyle}>予想数字</th>
              <th style={thStyle}>軸数字</th>
              <th style={thStyle}>特徴と狙い</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{row.type}</td>
                <td style={tdStyle}>{row.nums}</td>
                <td style={{ ...tdStyle, fontWeight: 700 }}>{row.axis}</td>
                <td style={{ ...tdStyle, textAlign: 'left' }}>{row.feature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 設定ページと全く同じ感覚で全幅100%、余白最小化
const outerStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: 0,
  margin: 0
};

const titleStyle = {
  fontSize: '1.10em',
  margin: '8px 0'
};

const scrollStyle = {
  width: '100%',
  overflowX: 'auto',
  margin: 0,
  padding: 0
};

const tableStyle = {
  width: '100%',
  minWidth: 440,
  borderCollapse: 'collapse',
  marginTop: 8,
  marginBottom: 8,
  background: '#fff',
  fontSize: '0.98em'
};

const thStyle = {
  border: '1px solid #bbb',
  padding: 4,
  background: '#f4f8fd',
  fontWeight: 600,
  textAlign: 'center'
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: 4,
  fontWeight: 400,
  textAlign: 'center'
};