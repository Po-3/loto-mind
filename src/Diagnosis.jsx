import { useEffect, useState } from 'react';

// ▼診断パターンリスト（全部盛り！）
const DIAGNOSIS_PATTERNS = [
  { id: 'notAppeared', label: '最近出ていない数字', desc: '過去30回で未出現の数字から抽出', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'appeared', label: 'よく出ている数字', desc: '直近30回で出現頻度が高い数字から抽出', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'random', label: '完全ランダム', desc: '完全無作為（すべての数字からランダム抽出）', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'odd', label: '奇数多め', desc: '奇数が多い構成（ミニロト・ロト6:4個以上, ロト7:5個以上）', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'even', label: '偶数多め', desc: '偶数が多い構成（ミニロト・ロト6:4個以上, ロト7:5個以上）', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'balanced', label: '奇数偶数バランス型', desc: '奇数偶数が均等（例：ロト6は3:3）', types: ['loto6'] },
  { id: 'consecutive', label: '連番入り', desc: '連続数字（例:24,25など）が必ず含まれる', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'sameLast', label: '下一桁同じ数字入り', desc: '下一桁が同じ数字（例:11,21など）が複数含まれる', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'lowZone', label: '低位ゾーン重視', desc: '最小ゾーン（1〜9）の数字を多めに選ぶ', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'midZone', label: '中位ゾーン重視', desc: '中央ゾーンの数字多め', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'highZone', label: '高位ゾーン重視', desc: '最大ゾーン（例：ロト6は31〜43など）多め', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'spread', label: 'まんべんなく全ゾーン', desc: '各ゾーンから最低1つは必ず選ぶ', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'narrowRange', label: '範囲が狭い', desc: '最小～最大のレンジが小さい構成', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'wideRange', label: '範囲が広い', desc: '最小～最大のレンジが大きい構成', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'lastDup', label: '前回かぶりあり', desc: '前回当選数字と1つ以上重複', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'lastUnique', label: '前回と完全非重複', desc: '前回当選数字と1つも重複しない', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'sumSmall', label: '合計値小さめ', desc: '合計値が小さい構成（しきい値は種別で変わる）', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'sumLarge', label: '合計値大きめ', desc: '合計値が大きい構成（しきい値は種別で変わる）', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'prime', label: '素数のみ', desc: '全部素数！（完全ネタ枠／ファン向け）', types: ['miniloto', 'loto6', 'loto7'] },
  { id: 'birthday', label: '誕生日数字縛り', desc: 'すべて「1〜31」の数字のみ', types: ['loto6', 'loto7'] },
  { id: 'carry', label: 'キャリーあり', desc: 'キャリー発生時・キャリー回のみ抽出', types: ['loto6', 'loto7'] },
];

// ロト種取得
function getLotoTypeFromUrl(jsonUrl) {
  if (jsonUrl.includes('miniloto')) return 'miniloto';
  if (jsonUrl.includes('loto6')) return 'loto6';
  if (jsonUrl.includes('loto7')) return 'loto7';
  return 'loto6'; // fallback
}

// ゾーン判定
const ZONE_DEF = {
  miniloto: { low: [1, 9], mid: [10, 20], high: [21, 31] },
  loto6: { low: [1, 9], mid: [10, 30], high: [31, 43] },
  loto7: { low: [1, 9], mid: [10, 24], high: [25, 37] },
};
const PRIME_SET = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43]);

// 乱数
function getRandomNums(nums, count) {
  const arr = [...nums];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Diagnosis({ jsonUrl }) {
  const [result, setResult] = useState(null);
  const [data, setData] = useState(null);
  const [pattern, setPattern] = useState('');
  const [desc, setDesc] = useState('');

  const lotoType = getLotoTypeFromUrl(jsonUrl);
  const patternList = DIAGNOSIS_PATTERNS.filter(p => p.types.includes(lotoType));

  // 初期化
  useEffect(() => {
    const obj = patternList.find(p => p.id === pattern) || patternList[0];
    setPattern(obj?.id || '');
    setDesc(obj?.desc || '');
  }, [lotoType]);

  useEffect(() => {
    const obj = patternList.find(p => p.id === pattern);
    setDesc(obj?.desc || '');
  }, [pattern, patternList]);

  useEffect(() => {
    setResult(null);
    fetch(jsonUrl)
      .then(res => res.json())
      .then(json => {
        setData(json.slice(-30));
      });
  }, [jsonUrl]);

  // ゾーン
  function getZone(n, type) {
    const { low, mid, high } = ZONE_DEF[type];
    if (n >= low[0] && n <= low[1]) return 'low';
    if (n >= mid[0] && n <= mid[1]) return 'mid';
    if (n >= high[0] && n <= high[1]) return 'high';
    return '';
  }
  function isConsecutive(nums) {
    const sorted = [...nums].sort((a, b) => a - b);
    return sorted.some((n, i) => i > 0 && n - sorted[i - 1] === 1);
  }
  function hasSameLast(nums) {
    const ones = {};
    nums.forEach(n => {
      const last = n % 10;
      ones[last] = (ones[last] || 0) + 1;
    });
    return Object.values(ones).some(v => v >= 2);
  }
  function isPrimeSet(nums) {
    return nums.every(n => PRIME_SET.has(n));
  }
  function getSumThreshold(type) {
    if (type === 'miniloto') return { small: 65, large: 105 };
    if (type === 'loto6') return { small: 100, large: 170 };
    if (type === 'loto7') return { small: 110, large: 180 };
    return { small: 0, large: 9999 };
  }

  // 診断本体
  function runDiagnosis(json, patternId) {
    let maxNum = 43, recommendCount = 6, numKeys = 6;
    if (lotoType === 'miniloto') {
      maxNum = 31; recommendCount = 5; numKeys = 5;
    } else if (lotoType === 'loto7') {
      maxNum = 37; recommendCount = 7; numKeys = 7;
    }
    let allNums = [];
    json.forEach(row => {
      for (let i = 1; i <= numKeys; i++) {
        const key = `第${i}数字`;
        let raw = row[key];
        if (typeof raw === "string") raw = raw.trim();
        if (raw !== undefined && raw !== null && raw !== "" && !isNaN(raw)) {
          const val = Number(raw);
          if (val > 0) allNums.push(val);
        }
      }
    });
    const all = Array.from({ length: maxNum }, (_, i) => i + 1);
    let nums = [];
    let tries = 0;
    let sum, oddCount, evenCount;

    while (++tries < 3000) {
      if (patternId === 'notAppeared') {
        const notAppear = all.filter(n => !allNums.includes(n));
        const pool = notAppear.length >= recommendCount ? notAppear : all;
        nums = getRandomNums(pool, recommendCount);
      } else if (patternId === 'appeared') {
        let freq = {};
        all.forEach(n => { freq[n] = 0; });
        allNums.forEach(n => { if (freq[n] !== undefined) freq[n]++; });
        const sorted = all.sort((a, b) => freq[b] - freq[a]);
        nums = getRandomNums(sorted.slice(0, recommendCount * 2), recommendCount);
      } else if (patternId === 'random') {
        nums = getRandomNums(all, recommendCount);
      } else if (patternId === 'odd') {
        nums = getRandomNums(all, recommendCount);
        oddCount = nums.filter(n => n % 2 === 1).length;
        if (
          (lotoType === 'loto7' && oddCount < 5) ||
          ((lotoType === 'miniloto' || lotoType === 'loto6') && oddCount < 4)
        ) continue;
      } else if (patternId === 'even') {
        nums = getRandomNums(all, recommendCount);
        evenCount = nums.filter(n => n % 2 === 0).length;
        if (
          (lotoType === 'loto7' && evenCount < 5) ||
          ((lotoType === 'miniloto' || lotoType === 'loto6') && evenCount < 4)
        ) continue;
      } else if (patternId === 'balanced' && lotoType === 'loto6') {
        nums = getRandomNums(all, recommendCount);
        oddCount = nums.filter(n => n % 2 === 1).length;
        if (oddCount !== 3) continue;
      } else if (patternId === 'consecutive') {
        nums = getRandomNums(all, recommendCount);
        if (!isConsecutive(nums)) continue;
      } else if (patternId === 'sameLast') {
        nums = getRandomNums(all, recommendCount);
        if (!hasSameLast(nums)) continue;
      } else if (patternId === 'lowZone') {
        nums = getRandomNums(all, recommendCount);
        if (nums.filter(n => getZone(n, lotoType) === 'low').length < Math.max(2, Math.floor(recommendCount / 2)))
          continue;
      } else if (patternId === 'midZone') {
        nums = getRandomNums(all, recommendCount);
        if (nums.filter(n => getZone(n, lotoType) === 'mid').length < Math.max(2, Math.floor(recommendCount / 2)))
          continue;
      } else if (patternId === 'highZone') {
        nums = getRandomNums(all, recommendCount);
        if (nums.filter(n => getZone(n, lotoType) === 'high').length < Math.max(2, Math.floor(recommendCount / 2)))
          continue;
      } else if (patternId === 'spread') {
        nums = getRandomNums(all, recommendCount);
        const zoneSet = new Set(nums.map(n => getZone(n, lotoType)));
        if (!(zoneSet.has('low') && zoneSet.has('mid') && zoneSet.has('high')))
          continue;
      } else if (patternId === 'narrowRange') {
        nums = getRandomNums(all, recommendCount);
        const sorted = [...nums].sort((a, b) => a - b);
        if (sorted[sorted.length - 1] - sorted[0] > Math.floor(maxNum / 3))
          continue;
      } else if (patternId === 'wideRange') {
        nums = getRandomNums(all, recommendCount);
        const sorted = [...nums].sort((a, b) => a - b);
        if (sorted[sorted.length - 1] - sorted[0] < Math.floor(maxNum * 0.8))
          continue;
      } else if (patternId === 'lastDup') {
        nums = getRandomNums(all, recommendCount);
        const prev = json[json.length - 1];
        const prevNums = [];
        for (let i = 1; i <= numKeys; i++) {
          let raw = prev[`第${i}数字`];
          if (typeof raw === "string") raw = raw.trim();
          if (raw !== undefined && raw !== null && raw !== "" && !isNaN(raw)) {
            prevNums.push(Number(raw));
          }
        }
        if (!nums.some(n => prevNums.includes(n))) continue;
      } else if (patternId === 'lastUnique') {
        nums = getRandomNums(all, recommendCount);
        const prev = json[json.length - 1];
        const prevNums = [];
        for (let i = 1; i <= numKeys; i++) {
          let raw = prev[`第${i}数字`];
          if (typeof raw === "string") raw = raw.trim();
          if (raw !== undefined && raw !== null && raw !== "" && !isNaN(raw)) {
            prevNums.push(Number(raw));
          }
        }
        if (nums.some(n => prevNums.includes(n))) continue;
      } else if (patternId === 'sumSmall') {
        nums = getRandomNums(all, recommendCount);
        sum = nums.reduce((a, b) => a + b, 0);
        if (sum > getSumThreshold(lotoType).small) continue;
      } else if (patternId === 'sumLarge') {
        nums = getRandomNums(all, recommendCount);
        sum = nums.reduce((a, b) => a + b, 0);
        if (sum < getSumThreshold(lotoType).large) continue;
      } else if (patternId === 'prime') {
        nums = getRandomNums(all, recommendCount);
        if (!isPrimeSet(nums)) continue;
      } else if (patternId === 'birthday') {
        const pool = all.filter(n => n >= 1 && n <= 31);
        nums = getRandomNums(pool, recommendCount);
      } else if (patternId === 'carry' && (lotoType === 'loto6' || lotoType === 'loto7')) {
        const carryRows = json.filter(row =>
          Number(row['キャリーオーバー'] || 0) > 0
        );
        if (!carryRows.length) continue;
        const sel = pickRandom(carryRows);
        nums = [];
        for (let i = 1; i <= numKeys; i++) {
          let raw = sel[`第${i}数字`];
          if (typeof raw === "string") raw = raw.trim();
          if (raw !== undefined && raw !== null && raw !== "" && !isNaN(raw)) {
            nums.push(Number(raw));
          }
        }
      } else {
        nums = getRandomNums(all, recommendCount);
      }
      break;
    }

    setResult({
      recommend: nums,
      comment: generateComment(nums, maxNum)
    });
  }

  function generateComment(nums, maxNum) {
    const sorted = [...nums].sort((a, b) => a - b);
    const min = sorted[0], max = sorted[sorted.length - 1];
    const range = max - min;
    const oddCount = nums.filter(n => n % 2 === 1).length;
    const evenCount = nums.length - oddCount;
    const hasConsecutive = isConsecutive(nums);
    const lowCount = nums.filter(n => getZone(n, lotoType) === 'low').length;
    const highCount = nums.filter(n => getZone(n, lotoType) === 'high').length;
    const allOdd = oddCount === nums.length;
    const allEven = evenCount === nums.length;
    const isBalanced = oddCount === evenCount;
    const isNarrow = range <= Math.floor(maxNum / 3);
    const isWide = range >= Math.floor(maxNum * 0.8);

    const patterns = [
      { check: () => hasConsecutive, comments: ["連番アタック！流れに乗る日は大きく当たる日。","連続数字が熱い！波に乗れそうな予感。","連番多め。勢い重視のギャンブラー型診断！"] },
      { check: () => allOdd, comments: ["全て奇数！波乱の予感漂うアグレッシブ診断。","オッズ型フルスロットル！攻めの日です。"] },
      { check: () => allEven, comments: ["全て偶数！堅実・安定感マックス。","偶数オンリー。落ち着いた構成で勝負！"] },
      { check: () => isBalanced, comments: ["奇数偶数バランス型。大穴狙いでも鉄板狙いでもイケる！","バランス型！何が来てもおかしくない絶妙ライン。"] },
      { check: () => lowCount >= Math.max(2, Math.floor(nums.length / 2)), comments: ["低位ゾーンに集中。地に足ついた堅実型！","1ケタばかりの慎重派。小さな当たりも積み重ね！"] },
      { check: () => highCount >= Math.max(2, Math.floor(nums.length / 2)), comments: ["高位ゾーンで夢を見ろ！一発逆転狙いの攻め型。","高位ゾーン中心のジャンボ狙い。"] },
      { check: () => isNarrow, comments: ["数字のまとまり感がスゴい！結束力バツグン。","レンジが狭い…団結力で当たりを呼ぶパターン!?"] },
      { check: () => isWide, comments: ["広範囲カバー型。どこからでも“当たり”を拾いに行ける！","ばらけている時こそ、意外な一発に期待！"] },
    ];
    for (const pattern of patterns) {
      if (pattern.check()) {
        return pickRandom(pattern.comments);
      }
    }
    const randomComments = [
      "今日は完全ランダム型。こういう時こそ神頼み！",
      "狙いはランダム、当たりもランダム!?",
      "“運”という名のギャンブル診断！",
      "選ばれし数字たちに身を委ねよう。",
      "今日の運勢はガチャガチャ仕様です。"
    ];
    return pickRandom(randomComments);
  }

  useEffect(() => {
    if (data && pattern) runDiagnosis(data, pattern);
  }, [data, pattern]);

  return (
    <div style={outerStyle}>
<div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <label>
          <select
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            style={{
              fontSize: '1em',
              padding: '5px 16px',
              borderRadius: 6,
              border: '1px solid #bbb',
              mmarginBottom: 4
            }}
          >
            {patternList.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
        <span style={{ color: '#666', fontSize: '0.98em', marginLeft: 4 }}>
          ※ {desc}
        </span>
      </div>
      <button
        style={{
          padding: '6px 16px',
          borderRadius: '6px',
          border: '1px solid #aaa',
          background: '#f4f4fc',
          color: '#345',
          marginBottom: 10,
          cursor: 'pointer'
        }}
        onClick={() => data && runDiagnosis(data, pattern)}
      >
        診断を更新
      </button>
      {result ? (
        <>
          <div style={numStyle}>
            {result.recommend.map(n => (
              <span key={n} style={numItemStyle}>{n}</span>
            ))}
          </div>
          <p style={{
            ...footerStyle,
            marginTop: 8,
            color: '#ca3',
            fontWeight: 500
          }}>{result.comment}</p>
          <p style={footerStyle}>上のロト種ボタンで切替えられるよ！<br />「当たったら教えてね！」by となり</p>
        </>
      ) : <p>診断中…</p>}
    </div>
  );
}

// スタイル
const outerStyle = {
  width: '100%',
  padding: '0 12px',
  boxSizing: 'border-box',
  margin: '0 auto',
  maxWidth: '640px'
};
const numStyle = {
  fontSize: '1.25em',
  margin: '8px 0',
  letterSpacing: '2px',
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap'
};
const numItemStyle = {
  fontWeight: 700,
  background: '#f0f8ff',
  padding: '4px 10px',
  borderRadius: '6px'
};
const footerStyle = {
  fontSize: '0.96em',
  color: '#248',
  marginTop: 12
};