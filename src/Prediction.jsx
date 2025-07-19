import { useEffect, useState } from 'react';

// URLパターン生成
function getPredictionUrl(lotoType, drawNo) {
  const prefix = lotoType === 'miniloto' ? 'miniloto' : lotoType;
  return `https://www.kujitonari.net/entry/${prefix}-${drawNo}-prediction-tonari`;
}

export default function Prediction({ lotoType }) {
  const [inputDrawNo, setInputDrawNo] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // inputDrawNoが変更された時に自動fetch
  useEffect(() => {
    if (!lotoType || !inputDrawNo) {
      setRows([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    setRows([]);
    const url = getPredictionUrl(lotoType, inputDrawNo);
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const doc = new window.DOMParser().parseFromString(html, 'text/html');
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
  }, [lotoType, inputDrawNo]);

  return (
    <div style={outerStyle}>
      <h2 style={titleStyle}>となりのズバリ予想</h2>
      <div style={searchRowStyle}>
        <input
          type="number"
          value={inputDrawNo}
          onChange={e => setInputDrawNo(e.target.value)}
          placeholder="開催回（例：2018）"
          style={inputStyle}
        />
      </div>

      {/* --- 結果表示 --- */}
      {loading && <div>読み込み中…</div>}
      {!loading && searched && !rows.length && (
        <div>ズバリ予想が取得できませんでした。</div>
      )}
      {!loading && rows.length > 0 && (
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
      )}
      {!searched && (
  <div style={{ color: '#888', fontSize: '0.98em', marginTop: 14 }}>
    開催回を入力すると自動で取得します。<br />
    <span style={{ color: '#d0323a', fontWeight: 700 }}>
      ※現在「{lotoType === 'miniloto'
        ? 'ミニロト'
        : lotoType === 'loto6'
        ? 'ロト6'
        : lotoType === 'loto7'
        ? 'ロト7'
        : lotoType}」が選択されています。<br />
      必ず対象ロトの開催回を入力してください。
    </span>
  </div>
)}

// ===== スタイル定義 =====

const outerStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0 12px',
  margin: 0
};

const titleStyle = {
  fontSize: '1.10em',
  margin: '8px 0',
  fontWeight: 600
};

const searchRowStyle = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  margin: '10px 0 14px 0'
};

const inputStyle = {
  width: 130,
  padding: '8px 10px',
  fontSize: '1em',
  borderRadius: 6,
  border: '1px solid #ccc',
  marginRight: 6
};

const scrollStyle = {
  width: '100%',
  overflowX: 'auto',
  margin: 0,
  padding: 0
};

const tableStyle = {
  width: '100%',
  minWidth: 480,
  borderCollapse: 'collapse',
  marginTop: 8,
  marginBottom: 8,
  background: '#fff',
  fontSize: '0.98em'
};

const thStyle = {
  border: '1px solid #bbb',
  padding: 6,
  background: '#f4f8fd',
  fontWeight: 600,
  textAlign: 'center'
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: 6,
  fontWeight: 400,
  textAlign: 'center'
};