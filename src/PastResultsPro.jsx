import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef } from 'react';

// --- ロト種別ごとの設定 ---
const lotoConfig = {
  miniloto: {
    main: 5,
    bonus: 1,
    bonusNames: ['ボーナス数字'],
    labels: [
      '連番あり', '奇数多め', '偶数多め', '下一桁かぶり', '合計小さめ', '合計大きめ'
    ],
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
      { rank: '4等', countKey: '4等口数', prizeKey: '4等賞金' }
    ],
  },
  loto6: {
    main: 6,
    bonus: 1,
    bonusNames: ['ボーナス数字'],
    labels: [
      '連番あり', '奇数多め', '偶数多め', 'バランス型', '下一桁かぶり',
      '合計小さめ', '合計大きめ', 'キャリーあり'
    ],
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
      { rank: '5等', countKey: '5等口数', prizeKey: '5等賞金' }
    ],
  },
  loto7: {
    main: 7,
    bonus: 2,
    bonusNames: ['BONUS数字1', 'BONUS数字2'],
    labels: [
      '連番あり', '奇数多め', '偶数多め', '下一桁かぶり', '合計小さめ', '合計大きめ', '高低ミックス', 'キャリーあり'
    ],
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
      { rank: '6等', countKey: '6等口数', prizeKey: '6等賞金' }
    ],
  }
};

// --- アイコン ---
const InfoIcon = ({ onClick }) => (
  <span style={{ display: 'inline-block', marginLeft: 6, cursor: 'pointer', color: '#e26580', fontSize: 15 }} onClick={onClick}>ⓘ</span>
);

export default function PastResultsPro({ jsonUrl, lotoType }) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    fromRound: '', toRound: '', fromDate: '', toDate: '',
    includeNumbers: '', excludeNumbers: '',
    features: [], minSum: '', maxSum: '',
    oddEven: '',
  });
  const [popup, setPopup] = useState({ show: false, text: '', x: 0, y: 0 });
  const [page, setPage] = useState(1);
  const popupRef = useRef();

  const config = lotoConfig[lotoType] || lotoConfig.loto6;

  // ...フィルター・ロジック等は今まで通り...

  function getFilterSummary() {
    const out = [];
    if (filter.features.length > 0) out.push(filter.features.join('・'));
    if (filter.includeNumbers) out.push(`${t('include_numbers')}:${filter.includeNumbers}`);
    if (filter.excludeNumbers) out.push(`${t('exclude_numbers')}:${filter.excludeNumbers}`);
    if (filter.fromRound || filter.toRound) out.push(`${t('from_round')}:${filter.fromRound || '?'}〜${filter.toRound || '?'}`);
    if (filter.fromDate || filter.toDate) out.push(`${t('from_date')}:${filter.fromDate || '?'}〜${filter.toDate || '?'}`);
    if (filter.oddEven) out.push(`${t('odd_even')}:${filter.oddEven.replace('-', t('vs'))}`);
    if (filter.minSum || filter.maxSum) out.push(`${t('sum')}:${filter.minSum || '?'}〜${filter.maxSum || '?'}`);
    if (out.length === 0) return '';
    return `（${out.join('，')}）`;
  }

  // --- 日付の正規化 ---
  function normalizeDate(str) {
    if (!str) return '';
    const [y, m, d] = str.split('/');
    if (!y || !m || !d) return '';
    return [y.padStart(4, '0'), m.padStart(2, '0'), d.padStart(2, '0')].join('-');
  }

  // --- Filtering ---
  const filtered = data.filter(row => {
    const round = Number(row['開催回']);
    const dateNorm = normalizeDate(row['日付']);
    if (filter.fromRound && round < Number(filter.fromRound)) return false;
    if (filter.toRound && round > Number(filter.toRound)) return false;
    if (filter.fromDate && dateNorm < filter.fromDate) return false;
    if (filter.toDate && dateNorm > filter.toDate) return false;
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

  // --- ページング＆CSV ---
  const PAGE_SIZE = 50;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pages = Math.ceil(filtered.length / PAGE_SIZE);

  // --- Util ---
  function sumMain(row) {
    return Array(config.main).fill(0).map((_, i) => Number(row[`第${i + 1}数字`])).reduce((a, b) => a + b, 0);
  }
  function toCSV(arr) {
    const head = [
      t('round'), t('date'),
      ...Array(config.main).fill(0).map((_, i) => t('main_num', { num: i + 1 })),
      ...config.bonusNames.map((_, i) => t('bonus_num', { num: i + 1 })),
      t('features'),
      ...(lotoType === 'loto6' || lotoType === 'loto7' ? [t('carryover')] : []),
      ...config.ranks.flatMap(rank => [
        t('rank_count', { rank: rank.rank }),
        t('rank_prize', { rank: rank.rank })
      ])
    ];
    const rows = arr.map(row => [
      row['開催回'], row['日付'],
      ...Array(config.main).fill(0).map((_, i) => row[`第${i + 1}数字`]),
      ...config.bonusNames.map(b => row[b] || ''),
      row['特徴'] || '',
      ...(lotoType === 'loto6' || lotoType === 'loto7' ? [row['キャリーオーバー'] || ''] : []),
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

  // --- 出現ランキング ---
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

  // --- データ取得 ---
  useEffect(() => {
    fetch(jsonUrl).then(res => res.json()).then(json => {
      json.sort((a, b) => Number(b['開催回']) - Number(a['開催回']));
      setData(json);
    });
  }, [jsonUrl]);

  // --- Infoポップアップ ---
  const handleInfo = (text, e) => {
    e.stopPropagation();
    if (!text || !text.trim()) return;
    // ポップアップを画面中央に表示
    const popupWidth = 240;
    const popupHeight = 80;
    const x = Math.max((window.innerWidth - popupWidth) / 2, 0);
    const y = Math.max((window.innerHeight - popupHeight) / 2, 0);
    setPopup({ show: true, text, x, y });
  };

  const hidePopup = () => setPopup(popup => ({ ...popup, show: false }));

  // --- 画面のどこかクリック・スクロール・Escで説明ポップアップを消す ---
  useEffect(() => {
    if (!popup.show) return;
    const handleClick = (e) => {
      if (popupRef.current && popupRef.current.contains(e.target)) return;
      setPopup(popup => ({ ...popup, show: false }));
    };
    const handleScroll = () => {
      setPopup(popup => ({ ...popup, show: false }));
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPopup(popup => ({ ...popup, show: false }));
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('scroll', handleScroll, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [popup.show]);

  // --- UI ---
  return (
    <>
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

      <div style={{
        background: '#f9f9fd',
        border: '1px solid #cde',
        borderRadius: 12,
        boxShadow: '0 1px 16px #eef3ff44',
        width: '100%',
        margin: '0 auto',
        padding: '4vw 2vw 3vw 2vw',
        boxSizing: 'border-box'
      }}>
        {/* フィルターUIは省略（前回通り） */}
      </div>

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
              <th style={{ ...thStyle, ...stickyLeftStyle }}>{t('round')}</th>
              <th style={thStyle}>{t('date')}</th>
              {Array(config.main).fill(0).map((_, i) => <th key={i} style={thStyle}>{t('main_num', { num: i + 1 })}</th>)}
              {config.bonusNames.map((_, i) => <th key={i} style={thStyle}>{t('bonus_num', { num: i + 1 })}</th>)}
              <th style={{ ...thStyle, minWidth: 180, width: '24%' }}>{t('features')}</th>
              <th style={thStyle}>{t('sum')}</th>
              {(lotoType === 'loto6' || lotoType === 'loto7') && (
                <th style={thStyle}>{t('carryover')}</th>
              )}
              {config.ranks.map(({ rank }) => (
                <th key={rank} style={thStyle}>{t('rank_count', { rank: rank.rank })}</th>
              ))}
              {config.ranks.map(({ rank }) => (
                <th key={rank + '_prize'} style={thStyle}>{t('rank_prize', { rank: rank.rank })}</th>
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
                <td style={{ ...tdStyle, color: '#135', fontWeight: 600 }}>{sumMain(row)}</td>
                {(lotoType === 'loto6' || lotoType === 'loto7') && (
                  <td style={{ ...tdStyle, color: '#c43', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {row['キャリーオーバー']
                      ? Number(row['キャリーオーバー']).toLocaleString()
                      : '―'}
                  </td>
                )}
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
    </>
  );
}

// --- Style群 ---
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
  borderBottom: '1.5px solid #dde',
  fontWeight: 600,
  background: '#f7faff',
  textAlign: 'center'
};
const tdStyle = {
  padding: '2px 5px',
  borderBottom: '1px solid #dde',
  textAlign: 'center'
};
const stickyLeftStyle = {
  position: 'sticky',
  left: 0,
  zIndex: 4,
  background: '#f7faff'
};