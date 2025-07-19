import { useEffect, useState } from 'react';

// ロト種別ごとの設定（省略、あなたのまま）

const stickyLeftStyle = {
  position: 'sticky',
  left: 0,
  zIndex: 4,
  background: '#f7faff'
};

export default function PastResultsPro({ jsonUrl, lotoType }) {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    number: '', label: '', minSum: '', maxSum: '', odd: '', even: ''
  });
  const [page, setPage] = useState(1);

  const config = lotoConfig[lotoType] || lotoConfig.loto6;

  // ... 省略（関数やfilterはそのまま）

  useEffect(() => {
    fetch(jsonUrl).then(res => res.json()).then(json => {
      json.sort((a, b) => Number(b['開催回']) - Number(a['開催回']));
      setData(json);
    });
  }, [jsonUrl]);

  const ranking = getRanking(filtered);

  return (
    <>
      {/* 固定の上下スクロールボタン */}
      <div style={{
        position: 'fixed',
        bottom: 22,
        right: 16,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        gap: 9
      }}>
        {/* ...上下ボタンはそのまま */}
      </div>
      <div style={{
        background: '#f9f9fd',
        border: '1px solid #cde',
        borderRadius: 12,
        boxShadow: '0 1px 16px #eef3ff44',
        width: '100%',
        margin: '0 auto',
        padding: '4vw 2vw 3vw 2vw', // スマホで縮まるようvwで調整
        boxSizing: 'border-box'
      }}>
        {/* 検索パネル */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 15, alignItems: 'flex-end'
        }}>
          {/* ...フィルターUIはそのまま */}
        </div>

        {/* 統計 */}
        <div style={{ fontSize: '0.97em', marginBottom: 9 }}>
          {/* ... */}
        </div>

        {/* 結果テーブル */}
        <div style={{
          overflowX: 'auto',
          border: '1px solid #ccd',
          background: '#fff',
          borderRadius: 8,
          marginBottom: 10,
          width: '100%',
          minWidth: 0, // 追加
        }}>
          <table style={{
            borderCollapse: 'collapse',
            width: '100%',
            minWidth: 650, // スマホだと横スクロール
            fontSize: '0.96em'
          }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, ...stickyLeftStyle }}>回</th>
                <th style={thStyle}>日付</th>
                {Array(config.main).fill(0).map((_, i) =>
                  <th key={i} style={thStyle}>本数字{i + 1}</th>
                )}
                {config.bonusNames.map((name, i) =>
                  <th key={name} style={thStyle}>B数字{i + 1}</th>
                )}
                <th style={thStyle}>特徴</th>
                <th style={thStyle}>合計</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(row => (
                <tr key={row['開催回']}>
                  <td style={{ ...tdStyle, ...stickyLeftStyle, fontWeight: 700 }}>{row['開催回']}</td>
                  <td style={tdStyle}>{row['日付']}</td>
                  {Array(config.main).fill(0).map((_, i) =>
                    <td key={i} style={{ ...tdStyle, color: '#1767a7', fontWeight: 600 }}>{row[`第${i + 1}数字`]}</td>
                  )}
                  {config.bonusNames.map((name, i) =>
                    <td key={name} style={{ ...tdStyle, color: '#fa5', fontWeight: 600 }}>{row[name]}</td>
                  )}
                  <td style={{ ...tdStyle, color: '#286', fontSize: '0.98em' }}>{row['特徴']}</td>
                  <td style={{ ...tdStyle, color: '#135', fontWeight: 600 }}>{sumMain(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* ページネーションはそのまま */}
      </div>
    </>
  );
}

const thStyle = {
  padding: '3px 6px',
  borderBottom: '1.5px solid #bbd',
  fontWeight: 600,
  background: '#f7faff',
  textAlign: 'center'
};
const tdStyle = {
  padding: '2px 5px',
  borderBottom: '1px solid #eef',
  textAlign: 'center'
};