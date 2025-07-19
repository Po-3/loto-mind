import { useState } from 'react';
import PastResultsPro from './PastResultsPro'; // ← 新しい過去検索コンポーネント
import PastResults from './PastResults';       // ※従来版（残してもOK）
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

  // 検索URL（loto6, miniloto, loto7で切り替え）
  const selectedUrl = tabs.find(t => t.key === selectedTab).url;

  return (
    <div style={{
      fontFamily: 'sans-serif',
      maxWidth: 520,
      margin: '24px auto',
      padding: 24,
      boxSizing: 'border-box'
    }}>
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
      <h1 style={{ textAlign: 'center', marginBottom: 12, lineHeight: 1.2 }}>
        LotoMind
        <br />
        <span style={{
          fontSize: '0.44em',
          color: '#888',
          fontWeight: 400,
          letterSpacing: '0.06em'
        }}>
          by tonari
        </span>
      </h1>
      {/* ロト種別タブ */}
      <div style={{
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 20,
        width: '100%'
      }}>
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
              cursor: 'pointer',
              flex: 1,
              minWidth: 0
            }}
          >{tab.label}</button>
        )}
      </div>
      {/* 機能タブ（ラベル風・2行対応） */}
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
        {features.map((f, idx) =>
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
              fontSize: '1.01em',
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
        )}
      </div>
      {/* メイン画面切り替え */}
      <div style={{ width: '100%' }}>
        {feature === 'past' && (
          <div style={{
            margin: '-20px -24px 0 -24px', // 親divの余白をキャンセルしてワイドに
            maxWidth: 'none'
          }}>
            <PastResultsPro jsonUrl={selectedUrl} />
          </div>
        )}
        {feature === 'diagnosis' && <Diagnosis jsonUrl={selectedUrl} />}
        {feature === 'prediction' && <Prediction lotoType={selectedTab} />}
        {feature === 'settings' && <Settings />}
      </div>
      <div style={{ textAlign: 'right', marginTop: 36, opacity: 0.5 }}>
        <span>数字くん👦がいつも応援中！</span>
      </div>
    </div>
  );
}