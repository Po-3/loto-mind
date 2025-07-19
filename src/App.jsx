import { useEffect, useState } from 'react';
import PastResultsPro from './PastResultsPro';
import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import Settings from './Settings';

// ロト種別タブ
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

function getLocalStorage(key, fallback) {
  return localStorage.getItem(key) || fallback;
}

export default function App() {
  // デフォルト値をlocalStorageから（初回のみ）
  const [selectedTab, setSelectedTab] = useState(getLocalStorage('defaultLotoType', 'loto6'));
  const [feature, setFeature] = useState(getLocalStorage('defaultMenu', 'past'));
  const [font, setFont] = useState(getLocalStorage('font', 'system-ui, Avenir, Helvetica, Arial, sans-serif'));
  const [theme, setTheme] = useState(getLocalStorage('theme', 'tonari'));

  // ロトデータURL
  const selectedUrl = tabs.find(t => t.key === selectedTab).url;

  // 設定ページからの変更で「今の画面」も必ず即切り替え！
  const handleLotoTypeChange = (type) => {
    setSelectedTab(type);
    localStorage.setItem('defaultLotoType', type);
  };
  const handleFeatureChange = (menu) => {
    setFeature(menu);
    localStorage.setItem('defaultMenu', menu);
  };
  const handleFontChange = (fontVal) => {
    setFont(fontVal);
    localStorage.setItem('font', fontVal);
  };
  const handleThemeChange = (themeVal) => {
    setTheme(themeVal);
    localStorage.setItem('theme', themeVal);
  };

  // フォント・テーマ即時反映
  useEffect(() => {
    document.body.style.fontFamily = font;
  }, [font]);
  useEffect(() => {
    if (theme === 'gray') {
      document.body.style.backgroundColor = '#eeeeee';
    } else if (theme === 'ivory') {
      document.body.style.backgroundColor = '#f9f6ee';
    } else {
      document.body.style.backgroundColor = '#fafcff';
    }
  }, [theme]);

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
            onClick={() => handleLotoTypeChange(tab.key)}
            style={{
              ...tabStyle,
              ...(selectedTab === tab.key ? activeTabStyle : {})
            }}
          >{tab.label}</button>
        )}
      </div>

      {/* 機能タブ */}
      <div style={featureTabRowStyle}>
        {features.map(f =>
          <button
            key={f.key}
            onClick={() => handleFeatureChange(f.key)}
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
            margin: '-12px -18px 0 -18px',
            maxWidth: 'none'
          }}>
            <PastResultsPro jsonUrl={selectedUrl} lotoType={selectedTab} />
          </div>
        )}
        {feature === 'diagnosis' && <Diagnosis jsonUrl={selectedUrl} lotoType={selectedTab} />}
        {feature === 'prediction' && <Prediction lotoType={selectedTab} />}
        {feature === 'settings' &&
          <Settings
            onThemeChange={handleThemeChange}
            onFontChange={handleFontChange}
            onDefaultLotoChange={(val) => {
              handleLotoTypeChange(val);
            }}
            onDefaultMenuChange={(val) => {
              handleFeatureChange(val);
            }}
            defaultLotoType={selectedTab}
            defaultMenu={feature}
            theme={theme}
            font={font}
          />
        }
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
        opacity: 0.72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4
      }}>
        <span>となり</span>
        <img
          src="/tonari.png"
          alt="となりくん"
          style={{
            width: 22,
            height: 22,
            marginLeft: 2,
            verticalAlign: 'middle',
            borderRadius: '50%',
            boxShadow: '0 1px 4px #bbb8'
          }}
        />
        <span style={{ fontSize: '0.90em', marginLeft: 2 }}>がいつも応援中！</span>
      </div>
    </div>
  );
}

// --- スタイル全定義（省略なし） ---
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