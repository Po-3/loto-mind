import { useState } from 'react';
import PastResults from './PastResults';
import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import Settings from './Settings';

const tabs = [
  { key: 'miniloto', label: 'ミニロト', url: 'https://po-3.github.io/miniloto-data/miniloto.json' },
  { key: 'loto6', label: 'ロト6', url: 'https://po-3.github.io/loto6-data/loto6.json' },
  { key: 'loto7', label: 'ロト7', url: 'https://po-3.github.io/loto7-data/loto7.json' },
];

const features = [
  { key: 'past', label: '過去検索', icon: '🔍' },
  { key: 'diagnosis', label: '数字くん診断', icon: '🧠' },
  { key: 'prediction', label: 'ズバリ予想', icon: '📊' },
  { key: 'settings', label: '設定', icon: '⚙️' }
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState('loto6');
  const [feature, setFeature] = useState('past');

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 520, margin: '24px auto', padding: 24 }}>
      {/* アイコン */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 4
      }}>
        <img
          src="/tonari.png"
          alt="となりアイコン"
          style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            boxShadow: '0 4px 18px #2222',
            objectFit: 'cover',
            background: '#fff'
          }}
        />
      </div>
      {/* タイトル */}
      <h1 style={{ textAlign: 'center', marginBottom: 12 }}>
  LotoMind<br />
  <span style={{
    fontSize: '0.42em',
    color: '#888',
    fontWeight: 400,
    letterSpacing: '0.06em'
  }}>
    by tonari
  </span>
</h1>
      {/* ロト種別タブ */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
        {tabs.map(tab =>
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            style={{
              fontWeight: selectedTab === tab.key ? 700 : 400,
              background: selectedTab === tab.key ? '#ededed' : '#fff',
              border: '1px solid #888',
              borderRadius: 8,
              padding: '8px 20px',
              cursor: 'pointer'
            }}
          >{tab.label}</button>
        )}
      </div>
      {/* 機能タブ */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 18 }}>
        {features.map(f =>
          <button
            key={f.key}
            onClick={() => setFeature(f.key)}
            style={{
              background: feature === f.key ? '#f0f0f0' : '#fff',
              border: '1px solid #bbb',
              borderRadius: 8,
              padding: '7px 14px',
              fontWeight: feature === f.key ? 700 : 400,
              fontSize: '1em',
              cursor: 'pointer'
            }}
          >{f.icon} {f.label}</button>
        )}
      </div>
      {/* メイン画面切り替え */}
      <div>
        {feature === 'past' && <PastResults jsonUrl={tabs.find(t => t.key === selectedTab).url} />}
        {feature === 'diagnosis' && <Diagnosis jsonUrl={tabs.find(t => t.key === selectedTab).url} />}
        {feature === 'prediction' && <Prediction lotoType={selectedTab} />}
        {feature === 'settings' && <Settings />}
      </div>
      <div style={{ textAlign: 'right', marginTop: 36, opacity: 0.5 }}>
        <span>数字くん👦がいつも応援中！</span>
      </div>
    </div>
  );
}