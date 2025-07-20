import { useEffect, useState } from 'react';

// ロト種別ごとの設定（必ずこのファイル内に！）
const lotoConfig = {
  loto6: {
    main: 6,
    bonus: 1,
    bonusNames: ['ボーナス数字'],
    labels: ['連番あり', '奇数多め', '偶数多め', '下一桁かぶり', '合計小さめ', '合計大きめ', 'キャリーあり'],
    min: 1,
    max: 43,
    oddEvenPatterns: [
      { label: '奇数6・偶数0', value: '6-0' }, { label: '奇数5・偶数1', value: '5-1' }, { label: '奇数4・偶数2', value: '4-2' },
      { label: '奇数3・偶数3', value: '3-3' }, { label: '奇数2・偶数4', value: '2-4' }, { label: '奇数1・偶数5', value: '1-5' }, { label: '奇数0・偶数6', value: '0-6' }
    ],
    sumRange: [21, 258],
    ranks: [
      { rank: '1等', countKey: '1等口数', prizeKey: '1等賞金' },
      { rank: '2等', countKey: '2等口数', prizeKey: '2等賞金' },
      { rank: '3等', countKey: '3等口数', prizeKey: '3等賞金' },
      { rank: '4等', countKey: '4等口数', prizeKey: '4等賞金' },
      { rank: '5等', countKey: '5等口数', prizeKey: '5等賞金' },
    ],
  },
  miniloto: {
    main: 5,
    bonus: 1,
    bonusNames: ['ボーナス数字'],
    labels: ['連番', '奇数多め', '偶数多め', 'バランス型', '下一桁かぶり', '合計小さめ', '合計大きめ'],
    min: 1,
    max: 31,
    oddEvenPatterns: [
      { label: '奇数5・偶数0', value: '5-0' }, { label: '奇数4・偶数1', value: '4-1' }, { label: '奇数3・偶数2', value: '3-2' },
      { label: '奇数2・偶数3', value: '2-3' }, { label: '奇数1・偶数4', value: '1-4' }, { label: '奇数0・偶数5', value: '0-5' }
    ],
    sumRange: [15, 145],
    ranks: [
      { rank: '1等', countKey: '1等口数', prizeKey: '1等賞金' },
      { rank: '2等', countKey: '2等口数', prizeKey: '2等賞金' },
      { rank: '3等', countKey: '3等口数', prizeKey: '3等賞金' },
      { rank: '4等', countKey: '4等口数', prizeKey: '4等賞金' },
    ],
  },
  loto7: {
    main: 7,
    bonus: 2,
    bonusNames: ['BONUS数字1', 'BONUS数字2'],
    labels: ['連番あり', '奇数多め', '偶数多め', '下一桁かぶり', '合計小さめ', '合計大きめ', 'キャリーあり'],
    min: 1,
    max: 37,
    oddEvenPatterns: [
      { label: '奇数7・偶数0', value: '7-0' }, { label: '奇数6・偶数1', value: '6-1' }, { label: '奇数5・偶数2', value: '5-2' }, { label: '奇数4・偶数3', value: '4-3' },
      { label: '奇数3・偶数4', value: '3-4' }, { label: '奇数2・偶数5', value: '2-5' }, { label: '奇数1・偶数6', value: '1-6' }, { label: '奇数0・偶数7', value: '0-7' }
    ],
    sumRange: [28, 273],
    ranks: [
      { rank: '1等', countKey: '1等口数', prizeKey: '1等賞金' },
      { rank: '2等', countKey: '2等口数', prizeKey: '2等賞金' },
      { rank: '3等', countKey: '3等口数', prizeKey: '3等賞金' },
      { rank: '4等', countKey: '4等口数', prizeKey: '4等賞金' },
      { rank: '5等', countKey: '5等口数', prizeKey: '5等賞金' },
      { rank: '6等', countKey: '6等口数', prizeKey: '6等賞金' },
    ],
  }
};

// アイコン（info用）
const InfoIcon = ({ onClick }) => (
  <span style={{ display: 'inline-block', marginLeft: 6, cursor: 'pointer', color: '#e26580', fontSize: 15 }} onClick={onClick}>ⓘ</span>
);

// スクロールボタンなどは省略（前回同様）

export default function PastResultsPro({ jsonUrl, lotoType }) {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    fromRound: '', toRound: '', fromDate: '', toDate: '',
    includeNumbers: '', excludeNumbers: '',
    features: [], minSum: '', maxSum: '',
    oddEven: '',
  });
  const [popup, setPopup] = useState({ show: false, text: '', x: 0, y: 0 });
  const [page, setPage] = useState(1);

  const config = lotoConfig[lotoType] || lotoConfig.loto6;

  // --- Filtering（省略） ---
  // ...中身そのまま...

  // --- Util ---
  function sumMain(row) {
    return Array(config.main).fill(0).map((_, i) => Number(row[`第${i + 1}数字`])).reduce((a, b) => a + b, 0);
  }
  // --- CSVにキャリーオーバー列を追加 ---
  function toCSV(arr) {
    const head = [
      '開催回', '日付',
      ...Array(config.main).fill(0).map((_, i) => `第${i + 1}数字`),
      ...config.bonusNames, '特徴',
      ...(lotoType === 'loto6' || lotoType === 'loto7' ? ['キャリーオーバー'] : []),
      ...config.ranks.flatMap(rank => [rank.countKey, rank.prizeKey])
    ];
    const rows = arr.map(row => [
      row['開催回'], row['日付'],
      ...Array(config.main).fill(0).map((_, i) => row[`第${i + 1}数字`]),
      ...config.bonusNames.map(b => row[b] || ''),
      row['特徴'] || '',
      ...(lotoType === 'loto6' || lotoType === 'loto7'
        ? [row['キャリーオーバー'] ? String(row['キャリーオーバー']).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '']
        : []),
      ...config.ranks.flatMap(rank => [row[rank.countKey] || '', row[rank.prizeKey] || ''])
    ]);
    return [head, ...rows].map(row => row.join(',')).join('\n');
  }
  function handleCSV() {
    const blob = new Blob([toCSV(filtered)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${lotoType}_results.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  // --- Fetch ---
  useEffect(() => {
    fetch(jsonUrl).then(res => res.json()).then(json => {
      json.sort((a, b) => Number(b['開催回']) - Number(a['開催回']));
      setData(json);
    });
  }, [jsonUrl]);

  // --- Infoポップアップ ---
  const handleInfo = (text, e) => {
    setPopup({ show: true, text, x: e.pageX, y: e.pageY });
  };
  const hidePopup = () => setPopup({ ...popup, show: false });

  // --- 表本体 ---
  return (
    <>
      {/* Infoポップアップ（省略） */}
      <div style={{
        overflowX: 'auto',
        border: '1px solid #ccd',
        background: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
        minWidth: 0
      }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 900, fontSize: '0.96em' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, ...stickyLeftStyle }}>回</th>
              <th style={thStyle}>日付</th>
              {Array(config.main).fill(0).map((_, i) => <th key={i} style={thStyle}>本数字{i + 1}</th>)}
              {config.bonusNames.map((name, i) => <th key={name} style={thStyle}>B数字{i + 1}</th>)}
              <th style={{ ...thStyle, minWidth: 180, width: '24%' }}>特徴</th>
              {(lotoType === 'loto6' || lotoType === 'loto7') && (
                <th style={thStyle}>キャリーオーバー</th>
              )}
              <th style={thStyle}>合計</th>
              {config.ranks.map(({ rank }) => (
                <th key={rank} style={thStyle}>{rank}口数</th>
              ))}
              {config.ranks.map(({ rank }) => (
                <th key={rank + '_prize'} style={thStyle}>{rank}賞金</th>
              ))}
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
                {(lotoType === 'loto6' || lotoType === 'loto7') && (
                  <td style={{ ...tdStyle, color: '#c43', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {row['キャリーオーバー']
                      ? Number(row['キャリーオーバー']).toLocaleString()
                      : '―'}
                  </td>
                )}
                <td style={{ ...tdStyle, color: '#135', fontWeight: 600 }}>{sumMain(row)}</td>
                {config.ranks.map(({ countKey }) => (
                  <td key={countKey} style={tdStyle}>{row[countKey] || ''}</td>
                ))}
                {config.ranks.map(({ prizeKey }) => (
                  <td key={prizeKey} style={tdStyle}>{row[prizeKey] || ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ページネーション等はそのまま */}
    </>
  );
}

// --- Style ---
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
const stickyLeftStyle = {
  position: 'sticky',
  left: 0,
  zIndex: 4,
  background: '#f7faff'
};
// 以下スタイルも必要に応じて追記