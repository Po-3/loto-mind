import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import { useState } from 'react';

function App() {
  const [lotoType, setLotoType] = useState('loto6'); // デフォルトでロト6
  const [drawNo, setDrawNo] = useState('');

  const handleTypeChange = (e) => setLotoType(e.target.value);
  const handleDrawChange = (e) => setDrawNo(e.target.value);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>ロト検索＆予想アプリ</h1>

      <div style={formStyle}>
        <label style={labelStyle}>
          ロト種別：
          <select value={lotoType} onChange={handleTypeChange} style={selectStyle}>
            <option value="miniloto">ミニロト</option>
            <option value="loto6">ロト6</option>
            <option value="loto7">ロト7</option>
          </select>
        </label>

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

const selectStyle = {
  padding: '8px 10px',
  fontSize: '1em',
  borderRadius: '6px',
  border: '1px solid #ccc'
};