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

  // 各特徴ラベルの説明
  const featureInfo = {
    '連番あり': '連続した数字（例：24・25など）を含む構成です。',
    '連番': '連続した数字（例：24・25など）を含む構成です。',
    '奇数多め': `${config.main >= 7 ? '5個以上' : config.main === 6 ? '4個以上' : '4個以上'}の奇数を含む構成です。`,
    '偶数多め': `${config.main >= 7 ? '5個以上' : config.main === 6 ? '4個以上' : '4個以上'}の偶数を含む構成です。`,
    'バランス型': '奇数と偶数が2:3または3:2などバランスよく含まれています。',
    '下一桁かぶり': '同じ下一桁の数字が2個以上（例：11・21など）含まれる構成です。',
    '合計小さめ': `合計値が${lotoType === 'loto7' ? '160未満' : lotoType === 'loto6' ? '110未満' : '60未満'}の構成です。`,
    '合計大きめ': `合計値が${lotoType === 'loto7' ? '160以上' : lotoType === 'loto6' ? '180以上' : '80以上'}の構成です。`,
    'キャリーあり': 'キャリーオーバーが発生していた回です。'
  };

  // --- Filtering ---
  const filtered = data.filter(row => {
    const round = Number(row['開催回']);
    const date = row['日付'];
    if (filter.fromRound && round < Number(filter.fromRound)) return false;
    if (filter.toRound && round > Number(filter.toRound)) return false;
    if (filter.fromDate && date < filter.fromDate) return false;
    if (filter.toDate && date > filter.toDate) return false;
    if (filter.features.length > 0 && !filter.features.every(f => (row['特徴'] || '').includes(f))) return false;
    const mainArr = Array(config.main).fill(0).map((_, i) => Number(row[`第${i + 1}数字`]));
    if (filter.includeNumbers) {
      const incl = filter.includeNumbers.split(',').map(s => Number(s.trim())).filter(Boolean);
      if (incl.length && !incl.every(n => mainArr.includes(n))) return false;
    }
    if (filter.excludeNumbers) {
      const excl = filter.excludeNumbers.split(',').map(s => Number(s.trim())).filter(Boolean);
      if (excl.length && excl.some(n => mainArr.includes(n))) return false;
    }
    if (filter.minSum && sumMain(row) < Number(filter.minSum)) return false;
    if (filter.maxSum && sumMain(row) > Number(filter.maxSum)) return false;
    if (filter.oddEven) {
      const odds = mainArr.filter(n => n % 2 === 1).length;
      const evens = config.main - odds;
      if (filter.oddEven !== `${odds}-${evens}`) return false;
    }
    return true;
  });

  // ---- Pagination & CSV ----
  const PAGE_SIZE = 50;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pages = Math.ceil(filtered.length / PAGE_SIZE);

  // --- Util ---
  function sumMain(row) {
    return Array(config.main).fill(0).map((_, i) => Number(row[`第${i + 1}数字`])).reduce((a, b) => a + b, 0);
  }

  // キャリーオーバー列付きCSV
  function toCSV(arr) {
    const head = [
      '開催回', '日付',
      ...Array(config.main).fill(0).map((_, i) => `第${i + 1}数字`),
      ...config.bonusNames, '特徴',
      ...config.ranks.flatMap(rank => [rank.countKey, rank.prizeKey])
    ];
    if (lotoType === 'loto6' || lotoType === 'loto7') head.push('キャリーオーバー');
    const rows = arr.map(row => {
      const rowArr = [
        row['開催回'], row['日付'],
        ...Array(config.main).fill(0).map((_, i) => row[`第${i + 1}数字`]),
        ...config.bonusNames.map(b => row[b] || ''),
        row['特徴'] || '',
        ...config.ranks.flatMap(rank => [row[rank.countKey] || '', row[rank.prizeKey] || ''])
      ];
      if (lotoType === 'loto6' || lotoType === 'loto7') rowArr.push(row['キャリーオーバー'] || '');
      return rowArr;
    });
    return [head, ...rows].map(row => row.join(',')).join('\n');
  }

  function handleCSV() {
    const blob = new Blob([toCSV(filtered)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${lotoType}_results.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  // 出現ランキング
  function getRanking(data) {
    const count = Array(config.max + 1).fill(0);
    data.forEach(row => {
      for (let i = 1; i <= config.main; ++i) {
        const n = Number(row[`第${i}数字`]);
        if (n) count[n]++;
      }
    });
    return count.map((c, n) => n === 0 ? null : { n, c }).filter(v => v).sort((a, b) => b.c - a.c);
  }
  const ranking = getRanking(filtered);

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

  // --- スタイル省略（前回どおり） ---
  // filterInputStyle, searchBtnStyle, resetBtnStyle, csvBtnStyle, thStyle, tdStyle, stickyLeftStyle

  return (
    <>
      {/* Infoポップアップ */}
      {popup.show && (
        <div
          style={{
            position: 'fixed', left: popup.x + 8, top: popup.y + 8,
            background: '#fff', border: '1px solid #e26580', borderRadius: 7, padding: 9,
            fontSize: 13, color: '#d94f4f', zIndex: 9999, maxWidth: 220, boxShadow: '2px 2px 7px #e2658055'
          }}
          onClick={hidePopup}
        >{popup.text}</div>
      )}

      {/* 検索ツール・省略 */}

      {/* --- テーブル --- */}
      <div style={{
        overflowX: 'auto',
        border: '1px solid #ccd',
        background: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        width: '100%',
        minWidth: 0
      }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 850, fontSize: '0.96em' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, ...stickyLeftStyle }}>回</th>
              <th style={thStyle}>日付</th>
              {Array(config.main).fill(0).map((_, i) => <th key={i} style={thStyle}>本数字{i + 1}</th>)}
              {config.bonusNames.map((name, i) => <th key={name} style={thStyle}>B数字{i + 1}</th>)}
              <th style={{ ...thStyle, minWidth: 180, width: '24%' }}>特徴</th>
              <th style={thStyle}>合計</th>
              {config.ranks.map(({ rank }) => (
                <th key={rank} style={thStyle}>{rank}口数</th>
              ))}
              {config.ranks.map(({ rank }) => (
                <th key={rank + '_prize'} style={thStyle}>{rank}賞金</th>
              ))}
              {(lotoType === 'loto6' || lotoType === 'loto7') && (
                <th style={thStyle}>キャリーオーバー</th>
              )}
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
                {config.ranks.map(({ countKey, prizeKey }) => (
                  <td key={countKey} style={tdStyle}>{row[countKey] || ''}</td>
                ))}
                {config.ranks.map(({ countKey, prizeKey }) => (
                  <td key={prizeKey} style={tdStyle}>{row[prizeKey] || ''}</td>
                ))}
                {(lotoType === 'loto6' || lotoType === 'loto7') && (
                  <td style={{ ...tdStyle, color: '#d43', fontWeight: 600 }}>
                    {row['キャリーオーバー'] || ''}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ページネーション・省略 */}
    </>
  );
}

// --- Style（お使いのまま） ---
const filterInputStyle = {
  marginLeft: 6,
  padding: '4px 8px',
  borderRadius: 5,
  border: '1px solid #ddd',
  fontSize: '0.98em',
  minWidth: 66
};
const searchBtnStyle = {
  background: '#e26580',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '7px 14px',
  fontWeight: 'bold',
  fontSize: 15,
  cursor: 'pointer'
};
const resetBtnStyle = {
  ...searchBtnStyle,
  background: '#d0a160'
};
const csvBtnStyle = {
  ...searchBtnStyle,
  background: '#46b955'
};
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