import { useEffect, useState } from 'react';

export default function Diagnosis({ jsonUrl }) {
  const [result, setResult] = useState(null);

  function getRandomNums(nums, count) {
    const arr = [...nums];
    arr.sort(() => Math.random() - 0.5);
    return arr.slice(0, count);
  }

  useEffect(() => {
    fetch(jsonUrl)
      .then(res => res.json())
      .then(json => {
        // 直近30回分
        const latest = json.slice(-30);
        const allNums = [];

        // 本数字のみ抽出
        latest.forEach(row => {
          for (let i = 1; i <= 6; i++) {
            const key = `第${i}数字`;
            if (row[key]) {
              const val = Number(row[key]);
              if (!isNaN(val) && val > 0) {
                allNums.push(val);
              }
            }
          }
        });

        // ロト種別判定
        let maxNum = 43, recommendCount = 6;
        if (jsonUrl.includes('miniloto')) {
          maxNum = 31; recommendCount = 5;
        } else if (jsonUrl.includes('loto7')) {
          maxNum = 37; recommendCount = 7;
        }
        const all = Array.from({ length: maxNum }, (_, i) => i + 1);

        // 出ていない数字
        const notAppear = all.filter(n => !allNums.includes(n));

        // デバッグ用
        // console.log({ allNums, notAppear, all, recommendCount });

        setResult({
          recommend: getRandomNums(
            notAppear.length ? notAppear : all,
            recommendCount
          )
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
          <p style={footerStyle}>「買ったら教えてね！」by となりくん</p>
        </>
      ) : <p>診断中…</p>}
    </div>
  );
}

// ▼ スタイル群
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