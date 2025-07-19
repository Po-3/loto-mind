import { useState } from 'react';
import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import PastResults from './PastResults'; // 仮：過去検索コンポーネント
import Settings from './Settings';       // 仮：設定コンポーネント

function App() {
  const [lotoType, setLotoType] = useState('loto6'); // ロト種別
  const [drawNo, setDrawNo] = useState('');          // 抽せん回入力
  const [activeTab, setActiveTab] = useState('prediction'); // 表示タブ

  const handleDrawChange = (e) => setDrawNo(e.target.value);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>ロト検索＆予想アプリ</h1>

      {/* ロト種別切替タブ */}
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

      {/* 抽せん回の入力フォーム（共通） */}
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

      {/* 表示中のタブに応じたコンポーネントを切り替え表示 */}
      {activeTab === 'prediction' && <Prediction lotoType={lotoType} drawNo={drawNo} />}
      {activeTab === 'diagnosis' && <Diagnosis jsonUrl={`/api/${lotoType}.json`} />}
      {activeTab === 'past' && <PastResults lotoType={lotoType} />}
      {activeTab === 'settings' && <Settings />}
    </div>
  );
}

export default App;

// --- スタイル定義 ---
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