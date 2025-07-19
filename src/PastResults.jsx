import { useEffect, useState } from 'react';

// 曜日配列
const week = ['日', '月', '火', '水', '木', '金', '土'];

// 日付文字列（yyyy/mm/ddなど）→「yyyy/mm/dd (曜)」変換
function withWeekday(str) {
  if (!str) return '';
  const date = new Date(str.replace(/-/g, '/'));
  if (isNaN(date.getTime())) return str;
  return `${str} (${week[date.getDay()]})`;
}

export default function PastResults({ jsonUrl }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(jsonUrl)
      .then(res => res.json())
      .then(json => setData(json.reverse()));
  }, [jsonUrl]);

  // 本数字とボーナス数字を抽出する関数
  const extractNumbers = (row) => {
    const main = Object.keys(row)
      .filter(k => /^第\d数字$/.test(k))
      .map(k => row[k])
      .join('・');
    const bonus = Object.keys(row)
      .filter(k => /BONUS数字|ボーナス数字/.test(k))
      .map(k => row[k])
      .join('・');
    return { main, bonus };
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.15em', marginBottom: 10 }}>全開催回の当せん結果</h2>
      <div style={{ maxHeight: 320, overflow: 'auto', fontSize: '0.98em' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ background: '#f8f8f8' }}>
              <th style={{ padding: '2px 5px', border: '1px solid #ccc' }}>回</th>
              <th style={{ padding: '2px 5px', border: '1px solid #ccc' }}>日付</th>
              <th style={{ padding: '2px 5px', border: '1px solid #ccc' }}>本数字</th>
              <th style={{ padding: '2px 5px', border: '1px solid #ccc' }}>B数字</th>
              <th style={{ padding: '2px 5px', border: '1px solid #ccc' }}>特徴</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => {
              const { main, bonus } = extractNumbers(row);
              return (
                <tr key={row['開催回']}>
                  <td style={{ padding: 2, border: '1px solid #ddd', textAlign: 'center' }}>{row['開催回']}</td>
                  <td style={{ padding: 2, border: '1px solid #ddd', textAlign: 'center' }}>
                    {withWeekday(row['日付'])}
                  </td>
                  <td style={{ padding: 2, border: '1px solid #ddd', textAlign: 'center' }}>{main}</td>
                  <td style={{ padding: 2, border: '1px solid #ddd', textAlign: 'center', color: '#a82' }}>{bonus}</td>
                  <td style={{ padding: 2, border: '1px solid #ddd', textAlign: 'center', fontSize: '0.98em', color: '#286' }}>{row['特徴']}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}