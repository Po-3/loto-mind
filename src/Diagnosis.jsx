import { useEffect, useState } from 'react';

export default function Diagnosis({ jsonUrl }) {
  const [result, setResult] = useState(null);

  function getRandomNums(nums, count) {
    // シャッフルしてcount個返す
    const arr = [...nums];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, count);
  }

  useEffect(() => {
    fetch(jsonUrl)
      .then(res => res.json())
      .then(json => {
        const latest = json.slice(-30);

        // ロト種別ごとに数字数をセット
        let maxNum = 43, recommendCount = 6, numKeys = 6;
        if (jsonUrl.includes('miniloto')) {
          maxNum = 31; recommendCount = 5; numKeys = 5;
        } else if (jsonUrl.includes('loto7')) {
          maxNum = 37; recommendCount = 7; numKeys = 7;
        }

        // 直近30回で出た本数字を全部配列化（重複OK）
        let allNums = [];
        latest.forEach(row => {
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

        // 本来出現可能な全数字
        const all = Array.from({ length: maxNum }, (_, i) => i + 1);

        // 直近30回で出てない数字リスト
        const notAppear = all.filter(n => !allNums.includes(n));

        // ---- ここが本質！ ----
        // notAppearが十分な数ない場合は、全数字からランダム
        const pool = notAppear.length >= recommendCount ? notAppear : all;

        setResult({
          recommend: getRandomNums(pool, recommendCount)
        });
      });
  }, [jsonUrl]);

  return (
    <div style={outerStyle}>
      <h2 style={titleStyle}>数字くん診断</h2>
      {result ? (
        <>
          <p style={descStyle}>直近で出ていない数字から選びました！</p>
          <div style={numStyle}>
            {result.recommend.map(n => (
              <span key={n} style={numItemStyle}>{n}</span>
            ))}
          </div>
          <p style={footerStyle}>「買ったら教えてね！」by となり</p>
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