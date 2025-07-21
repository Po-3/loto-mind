import { useEffect, useState } from 'react';

// 開催回数取得（NaNや空配列にも完全対応）
async function fetchLatestDrawNo(lotoType) {
  const urls = {
    miniloto: 'https://po-3.github.io/miniloto-data/miniloto.json',
    loto6: 'https://po-3.github.io/loto6-data/loto6.json',
    loto7: 'https://po-3.github.io/loto7-data/loto7.json'
  };
  const url = urls[lotoType];
  if (!url) return '';
  try {
    const res = await fetch(url);
    const data = await res.json();
    // '開催回' or '回' or 'drawNo' のどれかを数値で取得
    const allDrawNos = data.map(row =>
      Number(row['回'] ?? row['開催回'] ?? row['drawNo'])
    ).filter(n => !isNaN(n) && isFinite(n));
    if (!allDrawNos.length) return '';
    return Math.max(...allDrawNos);
  } catch {
    return '';
  }
}

// URLパターン生成
function getPredictionUrl(lotoType, drawNo) {
  if (!lotoType || !drawNo || isNaN(Number(drawNo)) || !isFinite(Number(drawNo))) return '';
  const prefix = lotoType === 'miniloto' ? 'miniloto' : lotoType;
  return `https://www.kujitonari.net/entry/${prefix}-${drawNo}-prediction-tonari`;
}

// ★予想実績データ取得
async function fetchPredictionScore(lotoType, drawNo) {
  if (!lotoType || !drawNo) return '';
  const id = `${lotoType}-${drawNo}`;
  try {
    const res = await fetch('https://www.kujitonari.net/loto-prediction-score');
    const html = await res.text();
    const doc = new window.DOMParser().parseFromString(html, 'text/html');
    const tr = doc.querySelector(`tr#${id}`);
    if (!tr) return '';
    return tr.innerHTML; // tbodyの<tr>中身だけ返す
  } catch {
    return '';
  }
}

export default function Prediction({ lotoType, latestDrawNoFromProps }) {
  const [inputDrawNo, setInputDrawNo] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [fetchingLatest, setFetchingLatest] = useState(false);

  // ▼予想実績
  const [scoreHtml, setScoreHtml] = useState('');
  const [scoreLoading, setScoreLoading] = useState(false);

  // ロト種別が未定義や不正値の場合は即ガード
  if (!lotoType || !['miniloto', 'loto6', 'loto7'].includes(lotoType)) {
    return (
      <div style={{ color: 'red', padding: 20 }}>
        ロト種別エラー（miniloto, loto6, loto7のみ対応）
      </div>
    );
  }

  // inputDrawNoが変更された時に自動fetch
  useEffect(() => {
    if (!lotoType || !inputDrawNo || isNaN(Number(inputDrawNo)) || !isFinite(Number(inputDrawNo))) {
      setRows([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    setRows([]);
    const url = getPredictionUrl(lotoType, inputDrawNo);
    if (!url) {
      setRows([]);
      setLoading(false);
      return;
    }
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

  // ★予想実績データ取得
  useEffect(() => {
    if (!inputDrawNo || !lotoType) {
      setScoreHtml('');
      return;
    }
    setScoreLoading(true);
    fetchPredictionScore(lotoType, inputDrawNo)
      .then(html => {
        setScoreHtml(html || '');
        setScoreLoading(false);
      })
      .catch(() => {
        setScoreHtml('');
        setScoreLoading(false);
      });
  }, [inputDrawNo, lotoType]);

  // 最新予想ボタン押下時
  const handleLatest = async () => {
  setFetchingLatest(true);
  let latestNo = '';
  // propsで最新開催回番号をもらった場合はそれを優先
  if (latestDrawNoFromProps && isFinite(Number(latestDrawNoFromProps))) {
    latestNo = Number(latestDrawNoFromProps) + 1;
  } else {
    const fetched = await fetchLatestDrawNo(lotoType);
    latestNo = isFinite(fetched) ? Number(fetched) + 1 : '';
  }
  setInputDrawNo(latestNo && isFinite(latestNo) ? String(latestNo) : '');
  setFetchingLatest(false);
};

  return (
    <div style={outerStyle}>
      <h2 style={titleStyle}>となりのズバリ予想</h2>
      <div style={searchRowStyle}>
        <input
          type="number"
          value={inputDrawNo}
          onChange={e => setInputDrawNo(e.target.value)}
          placeholder="（例：2018）"
          style={inputStyle}
        />
        <button
          style={buttonStyle}
          onClick={handleLatest}
          disabled={fetchingLatest}
        >
          {fetchingLatest ? '取得中…' : '最新予想'}
        </button>
      </div>

      {/* --- 結果表示 --- */}
      {loading && <div>読み込み中…</div>}
      {!loading && searched && !rows.length && (
        <div>ズバリ予想が取得できませんでした。</div>
      )}
      {!loading && rows.length > 0 && (
        <>
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

          {/* --- ★予想実績（答え合わせ） --- */}
          <div style={{ margin: '20px 0 0 0', background: '#fcfcf5', border: '1px solid #e4ddbc', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: '1.04em', marginBottom: 6, color: '#d0a33a' }}>
              ★予想実績（答え合わせ）
            </div>
            {scoreLoading ? (
              <div>読み込み中…</div>
            ) : scoreHtml ? (
              <table style={{ width: '100%', fontSize: '0.97em', background: 'transparent' }}>
                <tbody>
                  <tr dangerouslySetInnerHTML={{ __html: scoreHtml }} />
                </tbody>
              </table>
            ) : (
              <div style={{ color: '#aaa', fontSize: '0.95em' }}>実績データが見つかりませんでした。</div>
            )}
          </div>
        </>
      )}
      {!searched && (
        <div style={{ color: '#888', fontSize: '0.98em', marginTop: 14 }}>
          開催回を入力すると自動で取得します。
          <br />
          <span style={{ color: '#d0323a', fontWeight: 700 }}>
            ※現在「{lotoType === 'miniloto'
              ? 'ミニロト'
              : lotoType === 'loto6'
              ? 'ロト6'
              : lotoType === 'loto7'
              ? 'ロト7'
              : lotoType}」が選択されています。
            <br />
            必ず対象ロトの開催回を入力してください。
          </span>
        </div>
      )}
    </div>
  );
}

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

const buttonStyle = {
  padding: '8px 16px',
  fontSize: '1em',
  borderRadius: 6,
  border: '1px solid #1976d2',
  background: '#1a78e2',
  color: '#fff',
  cursor: 'pointer'
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