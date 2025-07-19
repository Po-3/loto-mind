export default function Prediction({ lotoType }) {
  const dummy = {
    miniloto: [
      { type: '万能型', nums: [5, 11, 19, 25, 30], axis: 19, feature: '直近偏り型からバランス回帰狙い' },
      { type: '堅実型', nums: [2, 8, 15, 23, 29], axis: 23, feature: '低位ゾーン強調・保守的構成' },
      { type: '勝負型', nums: [7, 13, 21, 27, 31], axis: 27, feature: '連番＋高位勝負型' }
    ],
    loto6: [
      { type: '万能型', nums: [3, 13, 21, 24, 32, 40], axis: 21, feature: '安定バランス重視' },
      { type: '堅実型', nums: [7, 8, 15, 23, 34, 37], axis: 8, feature: '偶数多め＋中位型' },
      { type: '勝負型', nums: [6, 18, 29, 33, 38, 43], axis: 33, feature: '高位＋奇数寄せで一発狙い' }
    ],
    loto7: [
      { type: '万能型', nums: [6, 8, 13, 21, 29, 34, 37], axis: 21, feature: 'バランス型・王道' },
      { type: '堅実型', nums: [4, 12, 17, 20, 25, 28, 32], axis: 20, feature: '安定感重視構成' },
      { type: '勝負型', nums: [2, 9, 15, 22, 27, 30, 35], axis: 27, feature: '極端構成で高配当狙い' }
    ]
  }[lotoType];

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '1.10em', margin: '8px 0' }}>となりのズバリ予想</h2>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{
          width: '100%',
          minWidth: 440,
          borderCollapse: 'collapse',
          marginTop: 8,
          marginBottom: 8,
          background: '#fff'
        }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #bbb', padding: 4, background: '#f4f8fd' }}>タイプ</th>
              <th style={{ border: '1px solid #bbb', padding: 4, background: '#f4f8fd' }}>予想数字</th>
              <th style={{ border: '1px solid #bbb', padding: 4, background: '#f4f8fd' }}>軸数字</th>
              <th style={{ border: '1px solid #bbb', padding: 4, background: '#f4f8fd' }}>特徴と狙い</th>
            </tr>
          </thead>
          <tbody>
            {dummy.map((row, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #ddd', padding: 4 }}>{row.type}</td>
                <td style={{ border: '1px solid #ddd', padding: 4 }}>{row.nums.join('・')}</td>
                <td style={{ border: '1px solid #ddd', padding: 4, fontWeight: 700 }}>{row.axis}</td>
                <td style={{ border: '1px solid #ddd', padding: 4 }}>{row.feature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: '0.95em', color: '#444' }}>※ 本番はブログ記事から自動取得可能</div>
    </div>
  );
}