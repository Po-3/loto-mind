import { useState } from 'react';
import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import PastResults from './PastResults';
import Settings from './Settings';

function App() {
  const [lotoType, setLotoType] = useState('loto6');
  const [drawNo, setDrawNo] = useState('');
  const [activeTab, setActiveTab] = useState('prediction');

  const handleDrawChange = (e) => setDrawNo(e.target.value);

  return (
    <div style={containerStyle}>
      {/* --- TOPヘッダー --- */}
      <div style={headerStyle}>
        <img src="/tonari.png" alt="tonari" style={iconStyle} />
        <span style={appNameStyle}>
          Loto <span style={{ color: '#1767a7' }}>Mind</span>
        </span>
      </div>
      <div style={{ textAlign: 'center', fontSize: '1em', marginBottom: 10, color: '#888' }}>
        by tonari
      </div>

      {/* --- ロト種別タブ --- */}
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

      {/* --- 4メニュー --- */}
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

      {/* --- 抽せん回入力 --- */}
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

      {/* --- メイン表示エリア --- */}
      {activeTab === 'prediction' && <Prediction lotoType={lotoType} drawNo={drawNo} />}
      {activeTab === 'diagnosis' && <Diagnosis jsonUrl={`/api/${lotoType}.json`} />}
      {activeTab === 'past' && <PastResults lotoType={lotoType} />}
      {activeTab === 'settings' && <Settings />}

      {/* --- フッター・ガイド文 --- */}
      <div style={guideStyle}>
        <strong>設定・ガイド</strong>
        <ul style={{ margin: '10px 0 10px 1.4em', padding: 0, fontSize: '1em' }}>
          <li>最新データはネットから自動取得</li>
          <li>「となり流」の予想構成や切り替えも同時可</li>
          <li>note・ブログ・Xとも連携予定</li>
          <li>広告なし・全機能無料！</li>
        </ul>
        <a
          href="https://www.kujitonari.net/"
          target="_blank"
          rel="noopener"
          style={{ color: '#1767a7', textDecoration: 'underline', fontWeight: 600 }}
        >
          宝くじのとなりブログ
        </a>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.98em', color: '#be9000', marginTop: 8 }}>
        数字くん🧑‍💻がいつも応援中！
      </div>
    </div>
  );
}

export default App;

// --- スタイル全定義 ---
const containerStyle = {
  width: '100%',
  maxWidth: 420,
  margin: '0 auto',
  padding: '24px 8px 10px 8px',
  boxSizing: 'border-box',
  fontSize: '16px',
  background: '#fafcff',
  borderRadius: 16,
  border: '1px solid #e0e8f3',
  marginTop: 36,
  boxShadow: '0 6px 24px #d2e4fa22',
};
const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  marginBottom: 2,
  marginTop: -14,
};
const appNameStyle = {
  fontSize: '2.1em',
  fontWeight: '700',
  fontFamily: 'sans-serif',
  letterSpacing: 0.5,
  userSelect: 'none',
};
const iconStyle = {
  width: 52,
  height: 52,
  borderRadius: '50%',
  boxShadow: '0 2px 12px #bbb5',
};
const guideStyle = {
  background: '#f8fafd',
  borderRadius: 12,
  border: '1px solid #eef1f7',
  margin: '32px 0 8px 0',
  padding: '15px 20px 5px 20px',
  fontSize: '1em',
};
// --- 4メニュー・ロト種別タブなど ---
const tabContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  flexWrap: 'wrap',
  marginBottom: '20px',
};
const tabStyle = {
  padding: '10px 16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  backgroundColor: '#f0f0f0',
  color: '#333',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1em',
};
const activeTabStyle = {
  ...tabStyle,
  backgroundColor: '#1767a7',
  color: '#fff',
  border: '1px solid #1767a7',
};
// --- 抽せん回入力 ---
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1em',
  marginBottom: '1.5em',
  alignItems: 'center',
};
const labelStyle = {
  fontWeight: 600,
  fontSize: '1em',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  width: '100%',
  maxWidth: 250,
};
const inputStyle = {
  padding: '8px 10px',
  fontSize: '1em',
  borderRadius: '6px',
  border: '1px solid #ccc',
  marginTop: '4px',
};