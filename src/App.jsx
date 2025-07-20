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

const DEFAULT_BG_COLOR = '#fafcff';

// localStorageから設定をまとめて取得
function getSettings() {
  return {
    defaultLotoType: localStorage.getItem('defaultLotoType') || 'loto6',
    defaultMenu: localStorage.getItem('defaultMenu') || 'past',
    font: localStorage.getItem('font') || 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    themeColor: localStorage.getItem('themeColor') || DEFAULT_BG_COLOR,
  };
}

export default function App() {
  // 設定値をstateで保持（設定変更時は都度再取得）
  const [settings, setSettings] = useState(getSettings());

  // ★localStorageの初期値を使って最初だけfeature/tabを決定！
  const [selectedTab, setSelectedTab] = useState(settings.defaultLotoType);
  const [feature, setFeature] = useState(settings.defaultMenu);
  const [font, setFont] = useState(settings.font);
  const [themeColor, setThemeColor] = useState(settings.themeColor);
  const [showScrollBtns, setShowScrollBtns] = useState(true);

  // 設定画面から呼ばれる
  const handleDefaultLotoChange = (type) => {
    localStorage.setItem('defaultLotoType', type);
    setSettings(getSettings());
    setSelectedTab(type);
  };
  const handleDefaultMenuChange = (menu) => {
    localStorage.setItem('defaultMenu', menu);
    setSettings(getSettings());
    setFeature(menu);
  };
  const handleFontChange = (fontVal) => {
    localStorage.setItem('font', fontVal);
    setFont(fontVal);
  };
  const handleThemeColorChange = (colorVal) => {
    localStorage.setItem('themeColor', colorVal);
    setThemeColor(colorVal);
  };

  // タブ・機能のユーザー操作時（localStorageは書き換えず、stateのみ切り替え）
  const handleTabChange = (tabKey) => setSelectedTab(tabKey);
  const handleFeatureChange = (menu) => setFeature(menu);

  useEffect(() => { document.body.style.fontFamily = font; }, [font]);
  useEffect(() => { document.body.style.backgroundColor = themeColor || DEFAULT_BG_COLOR; }, [themeColor]);

  // 設定値が変わったらstateも強制的に「デフォルト」に戻す（ロト種別のみ）
  useEffect(() => {
    setSelectedTab(settings.defaultLotoType);
  }, [settings.defaultLotoType]);

  // ↓↓↓ これを絶対にコメントアウトor削除してください！ ↓↓↓
  // useEffect(() => {
  //   setFeature(settings.defaultMenu);
  // }, [settings.defaultMenu]);
  // ↑↑↑ これがfeatureの強制リセット原因 ↑↑↑

  // スクロールボタンの制御
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
  const showPastScrollBtns = feature === 'past' && showScrollBtns;
  const showDiagnosisReload = feature === 'diagnosis';

  // --- 以降はUIのまま ---
  return (
    <div style={containerStyle}>
      {/* 右下：スクロール＋再読込ボタン群 */}
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
            onClick={() => window.location.reload()}
            style={scrollCircleButtonStyle}
            title="アプリを再読込（更新）"
            aria-label="アプリ再読込"
            type="button"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
              stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
              style={{ display: 'block', margin: 'auto' }}>
              <line x1="8" y1="10" x2="24" y2="10" />
              <polyline points="20 6 24 10 20 14" />
              <line x1="24" y1="22" x2="8" y2="22" />
              <polyline points="12 18 8 22 12 26" />
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
      </div>
    </div>
  );
}