import { useEffect, useState } from 'react';
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
  { key: 'past', label: '検索ツール' },
  { key: 'diagnosis', label: 'となり診断' },
  { key: 'prediction', label: 'ズバリ予想' },
  { key: 'settings', label: '設定' }
];
const DEFAULT_BG_COLOR = '#fafcff';

// --- ▼▼ ココ重要 ▼▼ ---
// sessionStorage > localStorage(default) の順で初期値を使う
function getStartupValue(key, defaultKey, fallback) {
  const session = sessionStorage.getItem('session_' + key);
  if (session) return session;
  return localStorage.getItem(defaultKey) || fallback;
}
function getSettings() {
  return {
    defaultLotoType: localStorage.getItem('defaultLotoType') || 'loto6',
    defaultMenu: localStorage.getItem('defaultMenu') || 'past',
    font: localStorage.getItem('font') || 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    themeColor: localStorage.getItem('themeColor') || DEFAULT_BG_COLOR,
  };
}

export default function App() {
  const [settings, setSettings] = useState(getSettings);

  // 初期値は sessionStorage優先
  const [selectedTab, setSelectedTab] = useState(() => getStartupValue('LotoType', 'defaultLotoType', 'loto6'));
  const [feature, setFeature] = useState(() => getStartupValue('Menu', 'defaultMenu', 'past'));
  const [font, setFont] = useState(settings.font);
  const [themeColor, setThemeColor] = useState(settings.themeColor);
  const [showScrollBtns, setShowScrollBtns] = useState(true);

  // 設定画面でデフォルト値が変わった時
  const handleDefaultLotoChange = (type) => {
    localStorage.setItem('defaultLotoType', type);
    setSettings(getSettings());
  };
  const handleDefaultMenuChange = (menu) => {
    localStorage.setItem('defaultMenu', menu);
    setSettings(getSettings());
  };
  const handleFontChange = (fontVal) => {
    localStorage.setItem('font', fontVal);
    setFont(fontVal);
  };
  const handleThemeColorChange = (colorVal) => {
    localStorage.setItem('themeColor', colorVal);
    setThemeColor(colorVal);
  };

  // タブ・機能切替時は sessionStorage にも保存（F5時のみ有効）
  const handleTabChange = (tabKey) => {
    setSelectedTab(tabKey);
    sessionStorage.setItem('session_LotoType', tabKey);
  };
  const handleFeatureChange = (menu) => {
    setFeature(menu);
    sessionStorage.setItem('session_Menu', menu);
  };

  // 完全終了時（window/tab close）→ sessionStorage消える → 起動時は設定値に戻る

  useEffect(() => { document.body.style.fontFamily = font; }, [font]);
  useEffect(() => { document.body.style.backgroundColor = themeColor || DEFAULT_BG_COLOR; }, [themeColor]);
  useEffect(() => {
    if (feature !== 'past') {
      setShowScrollBtns(true);
      return;
    }
    const handleScroll = () => {
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 50);
      setShowScrollBtns(!nearBottom);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [feature]);

  // 不正値対策
  const selectedTabObj = tabs.find(t => t.key === selectedTab) || tabs[1];
  const selectedUrl = selectedTabObj.url;
  const showPastScrollBtns = feature === 'past' && showScrollBtns;

  return (
    <div style={containerStyle}>
      {/* スクロールボタン */}
      {showPastScrollBtns && (
        <div style={scrollButtonContainer}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={scrollCircleButtonStyle} title="最上段へ" aria-label="最上段へ" type="button">
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
              <polyline points="12 6 12 18" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
              <polyline points="6 12 12 6 18 12" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} style={scrollCircleButtonStyle} title="最下段へ" aria-label="最下段へ" type="button">
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
              <polyline points="12 18 12 6" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
              <polyline points="6 12 12 18 18 12" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {/* アイコン＋見出し（ロゴ） */}
      <div style={headerContainerStyle}>
        <div style={logoRowStyle}>
          <span style={logoTextLeft}>Loto</span>
          <img src="/tonari.png" alt="となりアイコン" style={logoIconStyle} />
          <span style={logoTextRight}>Mind</span>
        </div>
        <div style={logoByTonariStyle}>by tonari</div>
      </div>

      {/* ロト種別タブ */}
      <div style={tabRowStyle}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            style={{
              ...tabStyle,
              ...(selectedTab === tab.key ? activeTabStyle : {}),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 機能タブ */}
      <div style={featureTabRowStyle}>
        {features.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFeatureChange(f.key)}
            style={{
              ...featureTabStyle,
              ...(feature === f.key ? activeFeatureTabStyle : {}),
            }}
          >
            <span style={{ whiteSpace: 'pre-line', lineHeight: 1.15 }}>{f.label}</span>
          </button>
        ))}
      </div>

      {/* メイン表示エリア */}
      <div style={{ width: '100%', position: 'relative' }}>
        {feature === 'past' && (
          <div style={{ margin: '-12px -18px 0 -18px', maxWidth: 'none' }}>
            <PastResultsPro jsonUrl={selectedUrl} lotoType={selectedTabObj.key} />
          </div>
        )}
        {feature === 'diagnosis' && (
          <Diagnosis jsonUrl={selectedUrl} lotoType={selectedTabObj.key} />
        )}
        {feature === 'prediction' && <Prediction lotoType={selectedTabObj.key} />}
        {feature === 'settings' && (
          <Settings
            onThemeColorChange={handleThemeColorChange}
            onFontChange={handleFontChange}
            onDefaultLotoChange={handleDefaultLotoChange}
            onDefaultMenuChange={handleDefaultMenuChange}
            defaultLotoType={settings.defaultLotoType}
            defaultMenu={settings.defaultMenu}
            themeColor={themeColor}
            font={font}
          />
        )}
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
      <div
        style={{
          textAlign: 'right',
          fontSize: '0.98em',
          color: '#be9000',
          marginTop: 8,
          opacity: 0.72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 4,
        }}
      >
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
            boxShadow: '0 1px 4px #bbb8',
          }}
        />
        <span style={{ fontSize: '0.90em', marginLeft: 2 }}>がいつも応援中！</span> 
        <a
  href="https://xa.shinobi.jp/bin/gg?192060200"
  target="_blank"
  rel="noopener noreferrer"
  style={{ marginLeft: 6, display: 'inline-block', verticalAlign: 'middle' }}
>
  <img
    src="https://xa.shinobi.jp/bin/ll?192060200"
    alt="アクセスカウンター"
    style={{ height: 18, verticalAlign: 'middle', border: 0 }}
  />
</a>
</div>
    </div>
  );
}

// --- スタイル定義 ---
const containerStyle = {
  width: '100%',
  maxWidth: 470,
  margin: '0 auto 0 auto',
  padding: '12px 8px 10px 8px',
  boxSizing: 'border-box',
  fontSize: '16px',
  background: 'transparent',
  borderRadius: 16,
  border: '1px solid #e0e8f3',
  marginTop: 10,
  boxShadow: '0 6px 24px #d2e4fa22',
};

const scrollButtonContainer = {
  position: 'fixed',
  bottom: 22,
  right: 16,
  zIndex: 90,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const scrollCircleButtonStyle = {
  background: '#337be8',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: 54,
  height: 54,
  minWidth: 54,
  minHeight: 54,
  fontSize: 26,
  boxShadow: '0 2px 10px #337be822',
  cursor: 'pointer',
  outline: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  padding: 0,
};

// ロゴ新スタイル
const headerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 6,
  marginTop: -8,
};

const logoRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 13,
  justifyContent: 'center',
};

const logoTextLeft = {
  fontSize: '2.0em',
  fontWeight: '700',
  letterSpacing: 0.5,
  color: '#222',
  fontFamily: 'sans-serif',
  marginRight: 2,
  userSelect: 'none',
};

const logoTextRight = {
  fontSize: '2.0em',
  fontWeight: '700',
  letterSpacing: 0.5,
  color: '#1767a7',
  fontFamily: 'sans-serif',
  marginLeft: 2,
  userSelect: 'none',
};

const logoIconStyle = {
  width: 53,
  height: 53,
  borderRadius: '50%',
  boxShadow: '0 2px 14px #bbb5',
  objectFit: 'cover',
  background: '#fff',
  margin: '0 2px',
};

const logoByTonariStyle = {
  fontSize: '0.98em',
  color: '#888',
  fontWeight: 400,
  marginTop: 2,
  letterSpacing: '0.07em',
  textAlign: 'center',
  userSelect: 'none',
};

const tabRowStyle = {
  display: 'flex',
  gap: 12,
  justifyContent: 'center',
  marginBottom: 15,
  width: '100%',
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
  marginRight: 'auto',
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