import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import { useState } from 'react';

function App() {
  const [lotoType, setLotoType] = useState('loto6'); // デフォルトはロト6
  const [drawNo, setDrawNo] = useState('');

  const handleDrawChange = (e) => setDrawNo(e.target.value);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>ロト検索＆予想アプリ</h1>

      {/* ロト種別：タブ形式に変更 */}
      <div style={tabContainerStyle}>
        <button
          style={lotoType === 'miniloto' ? activeTabStyle : tabStyle}
          onClick={() => setLotoType('miniloto')}
        >
          ミニロト
        </button>
        <button
          style={lotoType === 'loto6' ? activeTabStyle : tabStyle}
          onClick={() => setLotoType('loto6')}
        >
          ロト6
        </button>
        <button
          style={lotoType === 'loto7' ? activeTabStyle : tabStyle}
          onClick={() => setLotoType('loto7')}
        >
          ロト7
        </button>
      </div>

      {/* 抽せん回数の入力 */}
      <div style={formStyle}>
        <label style={labelStyle}>
          抽せん回（数字のみ）：
          <input
            type="number"
            value={drawNo}
            onChange={handleDrawChange}
            placeholder="例：2018"
            style={inputStyle}
          />
        </label>
      </div>

      {/* となりのズバリ予想 */}
      <Prediction lotoType={lotoType} drawNo={drawNo} />

      {/* 数字くん診断 */}
      <Diagnosis jsonUrl={`/api/${lotoType}.json`} />
    </div>
  );
}

export default App;

// --- Style定義 ---
const containerStyle = {
  width: '100%',
  maxWidth: 640,
  margin: '0 auto',
  padding: '16px 12px',
  boxSizing: 'border-box',
  fontSize: '16px'
};

const titleStyle = {
  fontSize: '1.8em',
  marginBottom: '1em',
  textAlign: 'center'
};

const tabContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  marginBottom: '20px'
};

const tabStyle = {
  padding: '10px 16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  backgroundColor: '#f0f0f0',
  color: '#333',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: '#1767a7',
  color: '#fff',
  border: '1px solid #1767a7'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1em',
  marginBottom: '1.5em'
};

const labelStyle = {
  fontWeight: 600,
  fontSize: '1em',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const inputStyle = {
  padding: '8px 10px',
  fontSize: '1em',
  borderRadius: '6px',
  border: '1px solid #ccc'
};