import { useEffect, useState } from 'react';

// ▼診断パターンリスト（全ロト種対応・プルダウン生成用）
const DIAGNOSIS_PATTERNS = [
  {
    id: 'notAppeared',
    label: '最近出ていない数字',
    desc: '過去30回で未出現の数字から抽出',
    types: ['miniloto', 'loto6', 'loto7']
  },
  {
    id: 'appeared',
    label: 'よく出ている数字',
    desc: '直近30回で出現頻度が高い数字から抽出',
    types: ['miniloto', 'loto6', 'loto7']
  },
  {
    id: 'random',
    label: '完全ランダム',
    desc: '完全無作為（すべての数字からランダム抽出）',
    types: ['miniloto', 'loto6', 'loto7']
  },
  {
    id: 'odd',
    label: '奇数多め',
    desc: '奇数が多い構成（ミニロト・ロト6:4個以上, ロト7:5個以上）',
    types: ['miniloto', 'loto6', 'loto7']
  },
  {
    id: 'even',
    label: '偶数多め',
    desc: '偶数が多い構成（ミニロト・ロト6:4個以上, ロト7:5個以上）',
    types: ['miniloto', 'loto6', 'loto7']
  },
  {
    id: 'balanced',
    label: '奇数偶数バランス型',
    desc: '奇数偶数が均等（例：ロト6は3:3）',
    types: ['loto6']
  },
  // ここ以降も同様に拡張可
];

function getLotoTypeFromUrl(jsonUrl) {
  if (jsonUrl.includes('miniloto')) return 'miniloto';
  if (jsonUrl.includes('loto6')) return 'loto6';
  if (jsonUrl.includes('loto7')) return 'loto7';
  return 'loto6'; // fallback
}

// 乱数ユーティリティ
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
  const [data, setData] = useState(null); // 直近30回データ
  const [pattern, setPattern] = useState('');
  const [desc, setDesc] = useState('');

  const lotoType = getLotoTypeFromUrl(jsonUrl);

  // ロト種ごとにパターン選択肢を絞る
  const patternList = DIAGNOSIS_PATTERNS.filter(p => p.types.includes(lotoType));

  // 選択状態初期化・切り替え時
  useEffect(() => {
    const obj = patternList.find(p => p.id === pattern) || patternList[0];
    setPattern(obj?.id || '');
    setDesc(obj?.desc || '');
  }, [lotoType]);

  useEffect(() => {
    const obj = patternList.find(p => p.id === pattern);
    setDesc(obj?.desc || '');
  }, [pattern, patternList]);

  // データ取得
  useEffect(() => {
    setResult(null); // ローディング用
    fetch(jsonUrl)
      .then(res => res.json())
      .then(json => {
        setData(json.slice(-30));
      });
  }, [jsonUrl]);

  // 診断実行
  function runDiagnosis(json, mode) {
    let maxNum = 43, recommendCount = 6, numKeys = 6;
    if (lotoType === 'miniloto') {
      maxNum = 31; recommendCount = 5; numKeys = 5;
    } else if (lotoType === 'loto7') {
      maxNum = 37; recommendCount = 7; numKeys = 7;
    }
    // --- 全開催回の本数字一覧 ---
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
    // --- 抽出ロジック分岐（patternごとに最適化して拡張） ---
    let nums = [];
    if (pattern === 'notAppeared') {
      const all = Array.from({ length: maxNum }, (_, i) => i + 1);
      const notAppear = all.filter(n => !allNums.includes(n));
      const pool = notAppear.length >= recommendCount ? notAppear : all;
      nums = getRandomNums(pool, recommendCount);
    } else if (pattern === 'appeared') {
      // よく出ている数字を上位から抽出
      const all = Array.from({ length: maxNum }, (_, i) => i + 1);
      let freq = {};
      all.forEach(n => { freq[n] = 0; });
      allNums.forEach(n => { if (freq[n] !== undefined) freq[n]++; });
      // 頻度ソート上位からランダム抽出
      const sorted = all.sort((a, b) => freq[b] - freq[a]);
      nums = getRandomNums(sorted.slice(0, recommendCount * 2), recommendCount);
    } else if (pattern === 'random') {
      const all = Array.from({ length: maxNum }, (_, i) => i + 1);
      nums = getRandomNums(all, recommendCount);
    } else if (pattern === 'odd') {
      const all = Array.from({ length: maxNum }, (_, i) => i + 1);
      let tries = 0;
      do {
        nums = getRandomNums(all, recommendCount);
        const oddCount = nums.filter(n => n % 2 === 1).length;
        if (
          (lotoType === 'loto7' && oddCount >= 5) ||
          ((lotoType === 'miniloto' || lotoType === 'loto6') && oddCount >= 4)
        ) break;
      } while (++tries < 2000);
    } else if (pattern === 'even') {
      const all = Array.from({ length: maxNum }, (_, i) => i + 1);
      let tries = 0;
      do {
        nums = getRandomNums(all, recommendCount);
        const evenCount = nums.filter(n => n % 2 === 0).length;
        if (
          (lotoType === 'loto7' && evenCount >= 5) ||
          ((lotoType === 'miniloto' || lotoType === 'loto6') && evenCount >= 4)
        ) break;
      } while (++tries < 2000);
    } else if (pattern === 'balanced' && lotoType === 'loto6') {
      const all = Array.from({ length: maxNum }, (_, i) => i + 1);
      let tries = 0;
      do {
        nums = getRandomNums(all, recommendCount);
        const oddCount = nums.filter(n => n % 2 === 1).length;
        if (oddCount === 3) break;
      } while (++tries < 3000);
    } else {
      // --- デフォルト：完全ランダム ---
      const all = Array.from({ length: maxNum }, (_, i) => i + 1);
      nums = getRandomNums(all, recommendCount);
    }

    setResult({
      recommend: nums,
      comment: generateComment(nums, maxNum)
    });
  }

  // コメント生成（旧ロジックそのまま）
  function generateComment(nums, maxNum) {
    const sorted = [...nums].sort((a, b) => a - b);
    const min = sorted[0], max = sorted[sorted.length - 1];
    const range = max - min;
    const oddCount = nums.filter(n => n % 2 === 1).length;
    const evenCount = nums.length - oddCount;
    const hasConsecutive = sorted.some((n, i) => i > 0 && n - sorted[i - 1] === 1);
    const lowCount = nums.filter(n => n <= Math.floor(maxNum / 3)).length;
    const highCount = nums.filter(n => n > Math.floor((maxNum * 2) / 3)).length;
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
      { check: () => lowCount >= nums.length - 1, comments: ["低位ゾーンに集中。地に足ついた堅実型！","1ケタばかりの慎重派。小さな当たりも積み重ね！"] },
      { check: () => highCount >= nums.length - 1, comments: ["高位ゾーンで夢を見ろ！一発逆転狙いの攻め型。","30番台中心のジャンボ狙い。"] },
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

  // 初回 or パターン選択変更時に診断
  useEffect(() => {
    if (data && pattern) runDiagnosis(data, pattern);
  }, [data, pattern]);

  return (
    <div style={outerStyle}>
      <div style={{ marginBottom: 12 }}>
        <label>
          <select
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            style={{
              fontSize: '1em',
              padding: '5px 16px',
              borderRadius: 6,
              border: '1px solid #bbb',
              marginRight: 10
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

// スタイル定義
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