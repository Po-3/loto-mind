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
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!lotoType || !inputDrawNo) {
      setRows([]);
      setSearched(false);
      setErrorMsg('');
      return;
    }
    setLoading(true);
    setSearched(true);
    setRows([]);
    setErrorMsg('');
    const url = getPredictionUrl(lotoType, inputDrawNo);

    fetch(url)
      .then(res => res.text())
      .then(html => {
        const doc = new window.DOMParser().parseFromString(html, 'text/html');
        // 1. 通常table
        let table = doc.querySelector('table');
        // 2. class名対応
        if (!table) table = doc.querySelector('table.loto-prediction-table');
        // 3. テーブルが複数の場合: trの多いもの
        if (!table) {
          const allTables = Array.from(doc.querySelectorAll('table'));
          table = allTables.sort((a, b) => b.querySelectorAll('tr').length - a.querySelectorAll('tr').length)[0];
        }

        if (!table) {
          setRows([]);
          setErrorMsg('表が見つかりませんでした（サイト構造変更の可能性あり）');
          setLoading(false);
          return;
        }

        const trs = table.querySelectorAll('tbody tr').length
          ? table.querySelectorAll('tbody tr')
          : table.querySelectorAll('tr');

        // 4列未満はデータでないので弾く
        const arr = [];
        trs.forEach(tr => {
          const tds = Array.from(tr.children);
          if (tds.length < 4) return;
          arr.push({
            type: tds[0]?.textContent.trim(),
            nums: tds[1]?.textContent.trim(),
            axis: tds[2]?.textContent.replace(/[^\d]/g, ''),
            feature: tds[3]?.textContent.trim()
          });
        });
        setRows(arr);
        setLoading(false);
        setErrorMsg(arr.length === 0 ? 'ズバリ予想データが見つかりませんでした（抽選日前や記事未公開の場合あり）' : '');
      })
      .catch((e) => {
        setRows([]);
        setErrorMsg('データ取得に失敗しました');
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
      {!loading && searched && !!errorMsg && (
        <div style={{ color: '#c44', fontWeight: 500 }}>{errorMsg}</div>
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
          開催回を入力すると自動で取得します。
        </div>
      )}
    </div>
  );
}

// ===== スタイル定義はそのまま =====

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