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

// localStorageから取得
function getLocalStorage(key, fallback) {
  return localStorage.getItem(key) || fallback;
}

// デフォルト背景色
const DEFAULT_BG_COLOR = '#fafcff';

// --- ページ遷移なしで再読込する ---
const forceReload = () => {
  if ('caches' in window) {
    caches.keys().then(names => {
      for (let name of names) caches.delete(name);
    }).finally(() => {
      window.location.reload();
    });
  } else {
    window.location.reload();
  }
};

export default function App() {
  // 初回だけlocalStorageから
  const [selectedTab, setSelectedTab] = useState(() => getLocalStorage('defaultLotoType', 'loto6'));
  const [feature, setFeature] = useState(() => getLocalStorage('defaultMenu', 'past'));
  const [font, setFont] = useState(getLocalStorage('font', 'system-ui, Avenir, Helvetica, Arial, sans-serif'));
  const [themeColor, setThemeColor] = useState(getLocalStorage('themeColor', DEFAULT_BG_COLOR));
  const [showScrollBtns, setShowScrollBtns] = useState(true);

  // タブ・設定切替
  const handleTabChange = (tabKey) => setSelectedTab(tabKey);
  const handleFeatureChange = (menu) => setFeature(menu);
  const handleDefaultLotoChange = (type) => localStorage.setItem('defaultLotoType', type);
  const handleDefaultMenuChange = (menu) => localStorage.setItem('defaultMenu', menu);
  const handleFontChange = (fontVal) => { setFont(fontVal); localStorage.setItem('font', fontVal); };
  const handleThemeColorChange = (colorVal) => { setThemeColor(colorVal); localStorage.setItem('themeColor', colorVal); };

  useEffect(() => { document.body.style.fontFamily = font; }, [font]);
  useEffect(() => { document.body.style.backgroundColor = themeColor || DEFAULT_BG_COLOR; }, [themeColor]);

  // ページ状態は初期化しない
  // useEffect(() => {
  //   setSelectedTab(getLocalStorage('defaultLotoType', 'loto6'));
  //   setFeature(getLocalStorage('defaultMenu', 'past'));
  // }, []);

  // スクロールで一番下判定してボタン制御
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

  const selectedUrl = tabs.find(t => t.key === selectedTab).url;

  // 右下ボタン群の出し分け
  const showPastScrollBtns = feature === 'past' && showScrollBtns;
  const showDiagnosisReload = feature === 'diagnosis';

  return (
    <div style={containerStyle}>
      {/* --- 右下：スクロール＋再読込ボタン群 --- */}
      {(showPastScrollBtns || showDiagnosisReload) && (
        <div style={scrollButtonContainer}>
          {showPastScrollBtns && (
            <>
              {/* 上へ */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={scrollCircleButtonStyle}
                title="最上段へ"
                aria-label="最上段へ"
                type="button"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
                  <polyline points="12 6 12 18" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
                  <polyline points="6 12 12 6 18 12" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" />
                </svg>
              </button>
              {/* 下へ */}
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                style={scrollCircleButtonStyle}
                title="最下段へ"
                aria-label="最下段へ"
                type="button"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
                  <polyline points="12 18 12 6" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
                  <polyline points="6 12 12 18 18 12" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}
          {/* 再読込（どちらのページでも） */}
          <button
            onClick={forceReload}
            style={scrollCircleButtonStyle}
            title="アプリを再読込（更新）"
            aria-label="アプリ再読込"
            type="button"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
  stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
  style={{ display: 'block', margin: 'auto' }}>
  {/* 右回り矢印（→） */}
  <polyline points="16 3 21 3 21 8" />
  <line x1="21" y1="3" x2="12" y2="12" />
  {/* 左回り矢印（←） */}
  <polyline points="8 21 3 21 3 16" />
  <line x1="3" y1="21" x2="12" y2="12" />
</svg>
          </button>
        </div>
      )}

      {/* アイコン＋見出し */}
      <div style={headerStyle}>
        <img src="/tonari.png" alt="となりアイコン" style={iconStyle} />
        <div style={titleBlockStyle}>
          <span style={appNameStyle}>
            Loto <span style={{ color: '#1767a7' }}>Mind</span>
          </span>
          <span style={byTonariStyle}>by tonari</span>
        </div>
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
            <PastResultsPro jsonUrl={selectedUrl} lotoType={selectedTab} />
          </div>
        )}
        {feature === 'diagnosis' && <Diagnosis jsonUrl={selectedUrl} lotoType={selectedTab} />}
        {feature === 'prediction' && <Prediction lotoType={selectedTab} />}
        {feature === 'settings' && (
          <Settings
            onThemeColorChange={handleThemeColorChange}
            onFontChange={handleFontChange}
            onDefaultLotoChange={handleDefaultLotoChange}
            onDefaultMenuChange={handleDefaultMenuChange}
            defaultLotoType={getLocalStorage('defaultLotoType', 'loto6')}
            defaultMenu={getLocalStorage('defaultMenu', 'past')}
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
  background: 'transparent',
  borderRadius: 16,
  border: '1px solid #e0e8f3',
  marginTop: 32,
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
  justifyContent: 'center',
};

const appNameStyle = {
  fontSize: '2.1em',
  fontWeight: '700',
  fontFamily: 'sans-serif',
  letterSpacing: 0.5,
  userSelect: 'none',
  lineHeight: 1.06,
};

const byTonariStyle = {
  fontSize: '0.98em',
  color: '#888',
  fontWeight: 400,
  marginTop: 2,
  marginLeft: 1,
  letterSpacing: '0.06em',
};

const iconStyle = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  boxShadow: '0 2px 14px #bbb5',
  objectFit: 'cover',
  background: '#fff',
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