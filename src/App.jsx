import { useState } from 'react';
import PastResultsPro from './PastResultsPro';
import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import Settings from './Settings';

const tabs = [
  { key: 'miniloto', label: 'ミニロト', url: 'https://po-3.github.io/miniloto-data/miniloto.json' },
  { key: 'loto6', label: 'ロト6', url: 'https://po-3.github.io/loto6-data/loto6.json' },
  { key: 'loto7', label: 'ロト7', url: 'https://po-3.github.io/loto7-data/loto7.json' },
];

const features = [
  { key: 'past', label: '過去検索' },
  { key: 'diagnosis', label: '数字くん\n診断' },
  { key: 'prediction', label: 'ズバリ予想' },
  { key: 'settings', label: '設定' }
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState('loto6');
  const [feature, setFeature] = useState('past');
  const selectedUrl = tabs.find(t => t.key === selectedTab).url;

  return (
    <div
      style={{
        maxWidth: 1280,
        width: '100%',
        margin: '0 auto',
        padding: '2rem',
        boxSizing: 'border-box',
        textAlign: 'left',
        fontFamily: 'sans-serif',
      }}
    >
      {/* ロゴ＆タイトル */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 14,
          userSelect: 'none'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <span
            style={{
              fontSize: '7vw',
              fontWeight: 800,
              color: '#337be8',
              letterSpacing: '0.08em',
              fontFamily: 'sans-serif'
            }}
          >
            Loto
          </span>
          <img
            src="/tonari.png"
            alt="となりアイコン"
            style={{
              width: '15vw',
              maxWidth: 76,
              height: '15vw',
              maxHeight: 76,
              borderRadius: '50%',
              boxShadow: '0 4px 18px #2222',
              objectFit: 'cover',
              background: '#fff'
            }}
          />
          <span
            style={{
              fontSize: '7vw',
              fontWeight: 800,
              color: '#337be8',
              letterSpacing: '0.08em',
              fontFamily: 'sans-serif'
            }}
          >
            Mind
          </span>
        </div>
        <span
          style={{
            fontSize: '1.01em',
            color: '#888',
            fontWeight: 500,
            letterSpacing: '0.09em',
            marginTop: 7
          }}
        >
          by tonari
        </span>
      </div>

      {/* ロト種別タブ */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          marginBottom: 20,
          width: '100%'
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            style={{
              fontWeight: selectedTab === tab.key ? 700 : 400,
              background: selectedTab === tab.key ? '#ededed' : '#fff',
              border: '1px solid #888',
              borderRadius: 8,
              padding: '2vw 3vw',
              cursor: 'pointer',
              flex: 1,
              minWidth: 0,
              fontSize: '1em'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 機能タブ */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 18,
          width: '100%',
          maxWidth: 440,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        {features.map(f => (
          <button
            key={f.key}
            onClick={() => setFeature(f.key)}
            style={{
              flex: 1,
              background: feature === f.key ? '#337be8' : '#f7f7f7',
              color: feature === f.key ? '#fff' : '#444',
              border: 'none',
              borderBottom: feature === f.key ? '3.5px solid #225bb7' : '3.5px solid #e3e3e3',
              fontWeight: feature === f.key ? 700 : 500,
              fontSize: '1em',
              cursor: 'pointer',
              padding: '12px 0 9px 0',
              minWidth: 0,
              outline: 'none',
              boxShadow: feature === f.key ? '0 2px 8px #337be811' : 'none',
              transition: 'all 0.12s'
            }}
          >
            <span style={{ whiteSpace: 'pre-line', lineHeight: 1.11 }}>
              {f.label}
            </span>
          </button>
        ))}
      </div>

      {/* メイン画面切り替え */}
      <div style={{ width: '100%' }}>
        {feature === 'past' && (
          <PastResultsPro jsonUrl={selectedUrl} lotoType={selectedTab} />
        )}
        {feature === 'diagnosis' && <Diagnosis jsonUrl={selectedUrl} />}
        {feature === 'prediction' && <Prediction lotoType={selectedTab} />}
        {feature === 'settings' && <Settings />}
      </div>

      <div style={{ textAlign: 'right', marginTop: 36, opacity: 0.5, fontSize: '0.97em' }}>
        <span>数字くん👦がいつも応援中！</span>
      </div>
    </div>
  );
}