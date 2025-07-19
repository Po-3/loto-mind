import { useState } from 'react';
import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import PastResults from './PastResults'; // 仮名
import Settings from './Settings';       // 仮名

function App() {
  const [lotoType, setLotoType] = useState('loto6');
  const [drawNo, setDrawNo] = useState('');
  const [activeTab, setActiveTab] = useState('prediction'); // 新タブ

  const handleDrawChange = (e) => setDrawNo(e.target.value);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>ロト検索＆予想アプリ</h1>

      {/* ロト種別タブ */}
      <div style={tabContainerStyle}>
        {['miniloto', 'loto6', 'loto7'].map((type) => (
          <button
            key={type}
            style={lotoType === type ? activeTabStyle : tabStyle}
            onClick={() => setLotoType(type)}
          >
            {type === 'miniloto' ? 'ミニロト' : type === 'loto6' ? 'ロト6' : 'ロト7'}
          </button>
        ))}
      </div>

      {/* 表示モード切替タブ */}
      <div style={tabContainerStyle}>
        <button
          style={activeTab === 'past' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('past')}
        >
          過去検索
        </button>
        <button
          style={activeTab === 'diagnosis' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('diagnosis')}
        >
          数字くん診断
        </button>
        <button
          style={activeTab === 'prediction' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('prediction')}
        >
          ズバリ予想
        </button>
        <button
          style={activeTab === 'settings' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('settings')}
        >
          設定
        </button>
      </div>

      {/* 抽せん回入力欄 */}
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

      {/* 各コンポーネント表示切り替え */}
      {activeTab === 'prediction' && <Prediction lotoType={lotoType} drawNo={drawNo} />}
      {activeTab === 'diagnosis' && <Diagnosis jsonUrl={`/api/${lotoType}.json`} />}
      {activeTab === 'past' && <PastResults lotoType={lotoType} />}
      {activeTab === 'settings' && <Settings />}
    </div>
  );
}

export default App;

const tabContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  flexWrap: 'wrap',
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