import { useState } from 'react';
import PastResultsPro from './PastResultsPro'; // 新しい過去検索コンポーネント
import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import Settings from './Settings';

// ロト種別タブ（ラベル＆データURLなど管理）
const tabs = [
  { key: 'miniloto', label: 'ミニロト', url: 'https://po-3.github.io/miniloto-data/miniloto.json' },
  { key: 'loto6', label: 'ロト6', url: 'https://po-3.github.io/loto6-data/loto6.json' },
  { key: 'loto7', label: 'ロト7', url: 'https://po-3.github.io/loto7-data/loto7.json' },
];

// 機能タブ
const features = [
  { key: 'past', label: '過去検索' },
  { key: 'diagnosis', label: 'となり診断' },
  { key: 'prediction', label: 'ズバリ予想' },
  { key: 'settings', label: '設定' }
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState('loto6');
  const [feature, setFeature] = useState('past');

  // jsonUrlはロト種別ごとに管理（Diagnosis等で使用）
  const selectedUrl = tabs.find(t => t.key === selectedTab).url;

  return (
    <div style={containerStyle}>
      {/* アイコン＋見出し */}
      <div style={headerStyle}>
        <img src="/tonari.png" alt="となりアイコン" style={iconStyle} />
        <div style={titleBlockStyle}>
          <span style={appNameStyle}>Loto <span style={{ color: '#1767a7' }}>Mind</span></span>
          <span style={byTonariStyle}>by tonari</span>
        </div>
      </div>
      
      {/* ロト種別タブ */}
      <div style={tabRowStyle}>
        {tabs.map(tab =>
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            style={{
              ...tabStyle,
              ...(selectedTab === tab.key ? activeTabStyle : {})
            }}
          >{tab.label}</button>
        )}
      </div>

      {/* 機能タブ（2行ラベル対応） */}
      <div style={featureTabRowStyle}>
        {features.map(f =>
          <button
            key={f.key}
            onClick={() => setFeature(f.key)}
            style={{
              ...featureTabStyle,
              ...(feature === f.key ? activeFeatureTabStyle : {})
            }}
          >
            <span style={{ whiteSpace: 'pre-line', lineHeight: 1.15 }}>
              {f.label}
            </span>
          </button>
        )}
      </div>

      {/* メイン表示エリア */}
      <div style={{ width: '100%' }}>
        {feature === 'past' && (
          <div style={{
            margin: '-12px -18px 0 -18px', // わずかに横幅拡張
            maxWidth: 'none'
          }}>
            <PastResultsPro jsonUrl={selectedUrl} lotoType={selectedTab} />
          </div>
        )}
        {feature === 'diagnosis' && <Diagnosis jsonUrl={selectedUrl} lotoType={selectedTab} />}
        {feature === 'prediction' && <Prediction lotoType={selectedTab} />}
        {feature === 'settings' && <Settings />}
      </div>
      
      {/* ガイド文＆リンク */}
      <div style={guideStyle}>
        <a
          href="https://www.kujitonari.net/"
          target="_blank"
          rel="noopener"
          style={{ color: '#1767a7', textDecoration: 'underline', fontWeight: 600 }}
        >
          宝くじのとなりブログ
        </a>
      </div>
      <div style={{
        textAlign: 'right',
        fontSize: '0.98em',
        color: '#be9000',
        marginTop: 8,
        opacity: 0.72
      }}>
        となり🧑‍💻がいつも応援中！
      </div>
    </div>
  );
}

// --- スタイル全定義 ---
const containerStyle = {
  width: '100%',
  maxWidth: 470,
  margin: '0 auto',
  padding: '20px 8px 10px 8px',
  boxSizing: 'border-box',
  fontSize: '16px',
  background: '#fafcff',
  borderRadius: 16,
  border: '1px solid #e0e8f3',
  marginTop: 32,
  boxShadow: '0 6px 24px #d2e4fa22',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 18,
  marginBottom: 6,
  marginTop: -10,
};
const titleBlockStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center'
};
const appNameStyle = {
  fontSize: '2.1em',
  fontWeight: '700',
  fontFamily: 'sans-serif',
  letterSpacing: 0.5,
  userSelect: 'none',
  lineHeight: 1.06
};
const byTonariStyle = {
  fontSize: '0.98em',
  color: '#888',
  fontWeight: 400,
  marginTop: 2,
  marginLeft: 1,
  letterSpacing: '0.06em'
};
const iconStyle = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  boxShadow: '0 2px 14px #bbb5',
  objectFit: 'cover',
  background: '#fff'
};

const tabRowStyle = {
  display: 'flex',
  gap: 12,
  justifyContent: 'center',
  marginBottom: 15,
  width: '100%'
};
const tabStyle = {
  fontWeight: 400,
  background: '#fff',
  border: '1px solid #888',
  borderRadius: 8,
  padding: '8px 20px',
  cursor: 'pointer',
  flex: 1,
  minWidth: 0,
  fontSize: '1em',
  transition: 'all 0.14s',
};
const activeTabStyle = {
  background: '#ededed',
  fontWeight: 700,
  border: '1.5px solid #1767a7',
  color: '#1767a7',
};

const featureTabRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 16,
  width: '100%',
  maxWidth: 440,
  marginLeft: 'auto',
  marginRight: 'auto'
};
const featureTabStyle = {
  flex: 1,
  background: '#f7f7f7',
  color: '#444',
  border: 'none',
  borderBottom: '3.5px solid #e3e3e3',
  fontWeight: 500,
  fontSize: '1.05em',
  cursor: 'pointer',
  padding: '12px 0 9px 0',
  minWidth: 0,
  outline: 'none',
  boxShadow: 'none',
  transition: 'all 0.12s',
};
const activeFeatureTabStyle = {
  background: '#337be8',
  color: '#fff',
  borderBottom: '3.5px solid #225bb7',
  fontWeight: 700,
  boxShadow: '0 2px 8px #337be811',
};

const guideStyle = {
  background: '#f8fafd',
  borderRadius: 12,
  border: '1px solid #eef1f7',
  margin: '32px 0 8px 0',
  padding: '15px 20px 5px 20px',
  fontSize: '1em',
};