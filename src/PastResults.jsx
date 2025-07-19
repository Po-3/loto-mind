import { useEffect, useState } from 'react';

export default function PastResults({ jsonUrl }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(jsonUrl)
      .then(res => res.json())
      .then(json => setData(json.slice(-30).reverse()));
  }, [jsonUrl]);

  return (
    <div>
      <h2 style={{ fontSize: '1.15em', marginBottom: 10 }}>過去30回の当せん結果</h2>
      <div style={{ maxHeight: 320, overflow: 'auto', fontSize: '0.98em' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ background: '#f8f8f8' }}>
              <th style={{ padding: '2px 5px', border: '1px solid #ccc' }}>回</th>
              <th style={{ padding: '2px 5px', border: '1px solid #ccc' }}>日付</th>
              <th style={{ padding: '2px 5px', border: '1px solid #ccc' }}>数字</th>
              <th style={{ padding: '2px 5px', border: '1px solid #ccc' }}>特徴</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row =>
              <tr key={row['開催回']}>
                <td style={{ padding: 2, border: '1px solid #ddd', textAlign: 'center' }}>{row['開催回']}</td>
                <td style={{ padding: 2, border: '1px solid #ddd', textAlign: 'center' }}>{row['日付']}</td>
                <td style={{ padding: 2, border: '1px solid #ddd', textAlign: 'center' }}>
                  {Object.keys(row).filter(k => /^第\d数字$/.test(k)).map(k => row[k]).join('・')}
                </td>
                <td style={{ padding: 2, border: '1px solid #ddd', textAlign: 'center', fontSize: '0.98em', color: '#286' }}>{row['特徴']}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}