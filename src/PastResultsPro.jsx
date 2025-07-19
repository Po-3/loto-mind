import { useEffect, useState } from 'react';

// ロト種別ごとの設定
const lotoConfig = {
  loto6: {
    main: 6,
    bonus: 1,
    bonusNames: ['ボーナス数字'],
    labels: ['連番あり', '奇数多め', '偶数多め', '下一桁かぶり', '合計小さめ', '合計大きめ', 'キャリーあり'],
    min: 1,
    max: 43,
  },
  miniloto: {
    main: 5,
    bonus: 1,
    bonusNames: ['ボーナス数字'],
    labels: ['連番', '奇数多め', '偶数多め', 'バランス型', '下一桁かぶり', '合計小さめ', '合計大きめ'],
    min: 1,
    max: 31,
  },
  loto7: {
    main: 7,
    bonus: 2,
    bonusNames: ['BONUS数字1', 'BONUS数字2'],
    labels: ['連番あり', '奇数多め', '偶数多め', '下一桁かぶり', '合計小さめ', '合計大きめ', 'キャリーあり'],
    min: 1,
    max: 37,
  }
};

// sticky用
const stickyLeftStyle = {
  position: 'sticky',
  left: 0,
  zIndex: 5,
  background: '#f7faff'
};
const stickyLeftStyle2 = {
  position: 'sticky',
  left: 74, // 1列目の幅に合わせて調整（px）
  zIndex: 5,
  background: '#f7faff'
};
const stickyTopStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 4,
  background: '#f7faff'
};
const stickyTopLeftStyle = {
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 10,
  background: '#f7faff'
};
const stickyTopLeftStyle2 = {
  position: 'sticky',
  top: 0,
  left: 74, // 1列目の幅
  zIndex: 10,
  background: '#f7faff'
};

export default function PastResultsPro({ jsonUrl, lotoType }) {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    number: '', label: '', minSum: '', maxSum: '', odd: '', even: ''
  });
  const [page, setPage] = useState(1);

  const config = lotoConfig[lotoType] || lotoConfig.loto6;

  const filtered = data.filter(row => {
    if (filter.label && !(row['特徴'] || '').includes(filter.label)) return false;
    if (filter.number) {
      let found = false;
      for (let i = 1; i <= config.main; ++i) if (row[`第${i}数字`] == filter.number) found = true;
      if (!found) return false;
    }
    if (filter.minSum && sumMain(row) < Number(filter.minSum)) return false;
    if (filter.maxSum && sumMain(row) > Number(filter.maxSum)) return false;
    if (filter.odd) {
      const odds = mainNums(row).filter(n => n % 2 === 1).length;
      if (filter.odd === '多め' && odds <= Math.floor(config.main / 2)) return false;
      if (filter.odd === '少なめ' && odds >= Math.ceil(config.main / 2)) return false;
    }
    if (filter.even) {
      const evens = mainNums(row).filter(n => n % 2 === 0).length;
      if (filter.even === '多め' && evens <= Math.floor(config.main / 2)) return false;
      if (filter.even === '少なめ' && evens >= Math.ceil(config.main / 2)) return false;
    }
    return true;
  });

  const PAGE_SIZE = 50;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pages = Math.ceil(filtered.length / PAGE_SIZE);

  function toCSV(arr) {
    const rows = arr.map(row =>
      config.labels.map(label => row[label] || '').join(',') +
      ',' +
      [
        row['開催回'],
        row['日付'],
        ...Array(config.main).fill(0).map((_, i) => row[`第${i + 1}数字`]),
        ...config.bonusNames.map(b => row[b] || ''),
        row['特徴'] || ''
      ].join(',')
    );
    return [
      [
        ...config.labels,
        '開催回',
        '日付',
        ...Array(config.main).fill(0).map((_, i) => `第${i + 1}数字`),
        ...config.bonusNames,
        '特徴'
      ].join(','),
      ...rows
    ].join('\n');
  }

  function handleCSV() {
    const blob = new Blob([toCSV(filtered)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${lotoType}_results.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  function getRanking(data) {
    const count = Array(config.max + 1).fill(0);
    data.forEach(row => {
      for (let i = 1; i <= config.main; ++i) {
        const n = Number(row[`第${i}数字`]);
        if (n) count[n]++;
      }
    });
    return count
      .map((c, n) => n === 0 ? null : { n, c })
      .filter(v => v)
      .sort((a, b) => b.c - a.c);
  }

  function mainNums(row) {
    return Array(config.main).fill(0).map((_, i) => Number(row[`第${i + 1}数字`]));
  }
  function sumMain(row) {
    return mainNums(row).reduce((a, b) => a + b, 0);
  }

  useEffect(() => {
    fetch(jsonUrl).then(res => res.json()).then(json => {
      json.sort((a, b) => Number(b['開催回']) - Number(a['開催回']));
      setData(json);
    });
  }, [jsonUrl]);

  const ranking = getRanking(filtered);

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 22,
        right: 16,
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        gap: 9
      }}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            background: '#337be8',
            color: '#fff',
            border: 'none',
            borderRadius: 32,
            width: 44,
            height: 44,
            fontSize: 24,
            boxShadow: '0 2px 8px #337be822',
            cursor: 'pointer',
            outline: 'none'
          }}
          title="最上段へ"
        >↑</button>
        <button
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          style={{
            background: '#337be8',
            color: '#fff',
            border: 'none',
            borderRadius: 32,
            width: 44,
            height: 44,
            fontSize: 24,
            boxShadow: '0 2px 8px #337be822',
            cursor: 'pointer',
            outline: 'none'
          }}
          title="最下段へ"
        >↓</button>
      </div>
      <div style={{
        background: '#f9f9fd', border: '1px solid #cde', borderRadius: 12,
        boxShadow: '0 1px 16px #eef3ff44', maxWidth: 940, margin: '0 auto', padding: 18
      }}>
        {/* 検索パネル（省略、元のまま） */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 15, alignItems: 'flex-end'
        }}>
          {/* ...フィルター系UIは元のまま */}
          {/* ...ここも省略可 */}
        </div>

        <div style={{ fontSize: '0.97em', marginBottom: 9 }}>
          検索結果：<b>{filtered.length}</b>件　
          <span style={{ color: '#357' }}>
            {filtered.length > 0 &&
              <>
                最多本数字：{ranking.slice(0, 3).map(v => <b key={v.n} style={{ color: '#357', marginLeft: 6 }}>{v.n}（{v.c}回）</b>)}　
                最少本数字：{ranking.slice(-3).map(v => <b key={v.n} style={{ color: '#d43', marginLeft: 6 }}>{v.n}（{v.c}回）</b>)}
              </>
            }
          </span>
        </div>

        {/* 結果テーブル */}
        <div style={{ overflowX: 'auto', border: '1px solid #ccd', background: '#fff', borderRadius: 8, marginBottom: 10 }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.96em', minWidth: 650 }}>
            <thead>
              <tr>
                {/* 開催回ヘッダー */}
                <th style={{ ...thStyle, ...stickyTopLeftStyle, width: 74 }}>回</th>
                {/* 日付ヘッダー */}
                <th style={{ ...thStyle, ...stickyTopLeftStyle2, width: 88 }}>日付</th>
                {/* 本数字ヘッダー */}
                {Array(config.main).fill(0).map((_, i) =>
                  <th key={i} style={{ ...thStyle, ...stickyTopStyle }}>{`本数字${i + 1}`}</th>
                )}
                {/* ボーナスヘッダー */}
                {config.bonusNames.map((name, i) =>
                  <th key={name} style={{ ...thStyle, ...stickyTopStyle }}>{`B数字${i + 1}`}</th>
                )}
                {/* 特徴/合計 */}
                <th style={{ ...thStyle, ...stickyTopStyle }}>特徴</th>
                <th style={{ ...thStyle, ...stickyTopStyle }}>合計</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(row => (
                <tr key={row['開催回']}>
                  {/* 開催回（列固定） */}
                  <td style={{ ...tdStyle, ...stickyLeftStyle, fontWeight: 700, width: 74 }}>{row['開催回']}</td>
                  {/* 日付（列固定） */}
                  <td style={{ ...tdStyle, ...stickyLeftStyle2, width: 88 }}>{row['日付']}</td>
                  {/* 本数字 */}
                  {Array(config.main).fill(0).map((_, i) =>
                    <td key={i} style={{ ...tdStyle, color: '#1767a7', fontWeight: 600 }}>{row[`第${i + 1}数字`]}</td>
                  )}
                  {/* ボーナス */}
                  {config.bonusNames.map((name, i) =>
                    <td key={name} style={{ ...tdStyle, color: '#fa5', fontWeight: 600 }}>{row[name]}</td>
                  )}
                  {/* 特徴/合計 */}
                  <td style={{ ...tdStyle, color: '#286', fontSize: '0.98em' }}>{row['特徴']}</td>
                  <td style={{ ...tdStyle, color: '#135', fontWeight: 600 }}>{sumMain(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* ページネーション（省略） */}
        {pages > 1 && (
          <div style={{ textAlign: 'center', margin: '10px 0 4px 0' }}>
            {Array.from({ length: pages }, (_, i) =>
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                style={{
                  margin: '0 2px',
                  padding: '2px 10px',
                  borderRadius: 4,
                  border: page === (i + 1) ? '2px solid #357' : '1px solid #aaa',
                  background: page === (i + 1) ? '#e4eeff' : '#f7f7f7',
                  color: '#135',
                  fontWeight: page === (i + 1) ? 700 : 400,
                  cursor: 'pointer'
                }}
              >{i + 1}</button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// テーブルスタイル共通化
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