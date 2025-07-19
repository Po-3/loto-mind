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
        const latest = json.slice(-30);
        const allNums = [];
        latest.forEach(row => {
          Object.keys(row).forEach(k => {
            if (/^第\d数字$/.test(k)) allNums.push(Number(row[k]));
          });
        });
        const lotoType = jsonUrl.includes('miniloto') ? 31 : jsonUrl.includes('loto7') ? 37 : 43;
        const all = Array.from({ length: lotoType }, (_, i) => i + 1);
        const notAppear = all.filter(n => !allNums.includes(n));
        setResult({
          recommend: getRandomNums(notAppear.length ? notAppear : all, jsonUrl.includes('miniloto') ? 5 : jsonUrl.includes('loto7') ? 7 : 6)
        });
      });
  }, [jsonUrl]);

  return (
    <div>
      <h2 style={{ fontSize: '1.10em' }}>数字くん診断</h2>
      {result ? (
        <>
          <p>直近で出ていない数字から選びました！</p>
          <div style={{ fontSize: '1.25em', margin: '8px 0', letterSpacing: 2 }}>
            {result.recommend.map(n => <span key={n} style={{ marginRight: 8, fontWeight: 700 }}>{n}</span>)}
          </div>
          <p style={{ fontSize: '0.96em', color: '#248' }}>「買ったら教えてね！」by 数字くん</p>
        </>
      ) : <p>診断中…</p>}
    </div>
  );
}