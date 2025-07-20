import { useEffect, useState } from 'react';

export default function Diagnosis({ jsonUrl }) {
  const [result, setResult] = useState(null);
  const [data, setData] = useState(null); // 直近30回データをキャッシュ

  // シャッフルしてcount個返す
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
      {
        check: () => hasConsecutive,
        comments: [
          "連番アタック！流れに乗る日は大きく当たる日。",
          "連続数字が熱い！波に乗れそうな予感。",
          "連番多め。勢い重視のギャンブラー型診断！"
        ]
      },
      {
        check: () => allOdd,
        comments: [
          "全て奇数！波乱の予感漂うアグレッシブ診断。",
          "オッズ型フルスロットル！攻めの日です。"
        ]
      },
      {
        check: () => allEven,
        comments: [
          "全て偶数！堅実・安定感マックス。",
          "偶数オンリー。落ち着いた構成で勝負！"
        ]
      },
      {
        check: () => isBalanced,
        comments: [
          "奇数偶数バランス型。大穴狙いでも鉄板狙いでもイケる！",
          "バランス型！何が来てもおかしくない絶妙ライン。"
        ]
      },
      {
        check: () => lowCount >= nums.length - 1,
        comments: [
          "低位ゾーンに集中。地に足ついた堅実型！",
          "1ケタばかりの慎重派。小さな当たりも積み重ね！"
        ]
      },
      {
        check: () => highCount >= nums.length - 1,
        comments: [
          "高位ゾーンで夢を見ろ！一発逆転狙いの攻め型。",
          "30番台中心のジャンボ狙い。"
        ]
      },
      {
        check: () => isNarrow,
        comments: [
          "数字のまとまり感がスゴい！結束力バツグン。",
          "レンジが狭い…団結力で当たりを呼ぶパターン!?"
        ]
      },
      {
        check: () => isWide,
        comments: [
          "広範囲カバー型。どこからでも“当たり”を拾いに行ける！",
          "ばらけている時こそ、意外な一発に期待！"
        ]
      }
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

  // 最初の一回だけfetch
  useEffect(() => {
    setResult(null); // ローディング用
    fetch(jsonUrl)
      .then(res => res.json())
      .then(json => {
        setData(json.slice(-30));
      });
  }, [jsonUrl]);

  // 診断実行
  function runDiagnosis(json) {
    let maxNum = 43, recommendCount = 6, numKeys = 6;
    if (jsonUrl.includes('miniloto')) {
      maxNum = 31; recommendCount = 5; numKeys = 5;
    } else if (jsonUrl.includes('loto7')) {
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
    const notAppear = all.filter(n => !allNums.includes(n));
    const pool = notAppear.length >= recommendCount ? notAppear : all;
    const nums = getRandomNums(pool, recommendCount);

    setResult({
      recommend: nums,
      comment: generateComment(nums, maxNum)
    });
  }

  // 初回診断
  useEffect(() => {
    if (data) runDiagnosis(data);
  }, [data]);

  // 診断の再抽選だけ（ボタンクリック時）
  function handleRefresh() {
    if (data) runDiagnosis(data);
  }

  return (
    <div style={outerStyle}>
      <h2 style={titleStyle}>となり診断</h2>
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
        onClick={handleRefresh}
      >
        診断を更新
      </button>
      {result ? (
        <>
          <p style={descStyle}>直近で出ていない数字から選びました！</p>
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
          <p style={footerStyle}>上のロト種ボタンで切替えられるよ</p>
        </>
      ) : <p>診断中…</p>}
    </div>
  );
}

// スタイル定義は省略（前のままでOK）
const outerStyle = {
  width: '100%',
  padding: '0 12px',
  boxSizing: 'border-box',
  margin: '0 auto',
  maxWidth: '640px'
};
const titleStyle = {
  fontSize: '1.15em',
  margin: '12px 0 8px 0'
};
const descStyle = {
  fontSize: '1em',
  margin: '0 0 8px'
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