import './i18n';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PastResultsPro from './PastResultsPro';
import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import Settings from './Settings';
import WinningOutlet from './components/WinningOutlet.jsx';
import SplashScreen from './components/SplashScreen';

const tabs = [
  { key: 'miniloto', labelKey: 'miniloto', url: 'https://po-3.github.io/miniloto-data/miniloto.json' },
  { key: 'loto6', labelKey: 'loto6', url: 'https://po-3.github.io/loto6-data/loto6.json' },
  { key: 'loto7', labelKey: 'loto7', url: 'https://po-3.github.io/loto7-data/loto7.json' },
];
const features = [
  { key: 'past', labelKey: 'past' },
  { key: 'diagnosis', labelKey: 'diagnosis' },
  { key: 'prediction', labelKey: 'prediction' },
  { key: 'settings', labelKey: 'settings_tab' },
];
const DEFAULT_BG_COLOR = '#fafcff';
const DEFAULT_TEXT_COLOR = '#191919';

// ---- 初期値取得 ----
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
    textColor: localStorage.getItem('textColor') || DEFAULT_TEXT_COLOR,
  };
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const [settings, setSettings] = useState(getSettings);
  const [selectedTab, setSelectedTab] = useState(() => getStartupValue('LotoType', 'defaultLotoType', 'loto6'));
  const [feature, setFeature] = useState(() => getStartupValue('Menu', 'defaultMenu', 'past'));
  const [font, setFont] = useState(settings.font);
  const [themeColor, setThemeColor] = useState(settings.themeColor);
  const [textColor, setTextColor] = useState(settings.textColor);
  const [showScrollBtns, setShowScrollBtns] = useState(true);

  // --- Settingsハンドラ ---
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
  const handleTextColorChange = (colorVal) => {
    localStorage.setItem('textColor', colorVal);
    setTextColor(colorVal);
  };

  const handleTabChange = (tabKey) => {
    setSelectedTab(tabKey);
    sessionStorage.setItem('session_LotoType', tabKey);
  };
  const handleFeatureChange = (menu) => {
    setFeature(menu);
    sessionStorage.setItem('session_Menu', menu);
  };

  // --- グローバル反映 ---
  useEffect(() => { document.body.style.fontFamily = font; }, [font]);
  useEffect(() => { document.body.style.backgroundColor = themeColor || DEFAULT_BG_COLOR; }, [themeColor]);
  useEffect(() => { document.body.style.color = textColor || DEFAULT_TEXT_COLOR; }, [textColor]);
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

  const selectedTabObj = tabs.find(t => t.key === selectedTab) || tabs[1];
  const selectedUrl = selectedTabObj.url;
  const showPastScrollBtns = feature === 'past' && showScrollBtns;

  // ---- スプラッシュ判定 ----
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // ---- メインUI ----
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 470,
        margin: '0 auto',
        padding: '12px 8px 10px 8px',
        boxSizing: 'border-box',
        fontSize: '16px',
        background: themeColor,
        color: textColor,
        fontFamily: font,
        borderRadius: 16,
        border: '1px solid #e0e8f3',
        marginTop: 10,
        boxShadow: '0 6px 24px #d2e4fa22',
      }}
    >
      {/* スクロールボタン */}
      {showPastScrollBtns && (
        <div style={{
          position: 'fixed',
          bottom: 22,
          right: 16,
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{
            background: '#337be8',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 54, height: 54,
            fontSize: 26,
            boxShadow: '0 2px 10px #337be822',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
              <polyline points="12 6 12 18" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
              <polyline points="6 12 12 6 18 12" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} style={{
            background: '#337be8',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 54, height: 54,
            fontSize: 26,
            boxShadow: '0 2px 10px #337be822',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
              <polyline points="12 18 12 6" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
              <polyline points="6 12 12 18 18 12" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {/* アイコン＋見出し（ロゴ） */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 6,
        marginTop: -8,
      }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 13,
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'opacity .13s',
            opacity: 0.97,
          }}
          title="最新の画面にリロード"
          onClick={() => window.location.reload()}
          tabIndex={0}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && window.location.reload()}
          role="button"
          aria-label="ロゴをタップでリロード"
        >
          <span style={{
            fontSize: '2.0em', fontWeight: '700', letterSpacing: 0.5, color: textColor,
            fontFamily: 'sans-serif', marginRight: 2, userSelect: 'none',
          }}>Loto</span>
          <img src="/tonari.png" alt="となりアイコン" style={{
            width: 53, height: 53, borderRadius: '50%',
            boxShadow: '0 2px 14px #bbb5', objectFit: 'cover',
            background: '#fff', margin: '0 2px',
          }} />
          <span style={{
            fontSize: '2.0em', fontWeight: '700', letterSpacing: 0.5, color: '#1767a7',
            fontFamily: 'sans-serif', marginLeft: 2, userSelect: 'none',
          }}>Mind</span>
        </div>
        <div style={{
          fontSize: '0.98em', color: textColor,
          fontWeight: 400, marginTop: 2, letterSpacing: '0.07em',
          textAlign: 'center', userSelect: 'none',
        }}>
          {t('by_tonari')}
        </div>
      </div>

      {/* ロト種別タブ */}
      <div style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        marginBottom: 15,
        width: '100%',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            style={{
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
              ...(selectedTab === tab.key ? {
                background: '#ededed',
                fontWeight: 700,
                border: '1.5px solid #1767a7',
                color: '#1767a7',
              } : {}),
            }}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* 機能タブ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 16,
        width: '100%',
        maxWidth: 440,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        {features.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFeatureChange(f.key)}
            style={{
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
              ...(feature === f.key ? {
                background: '#337be8',
                color: '#fff',
                borderBottom: '3.5px solid #225bb7',
                fontWeight: 700,
                boxShadow: '0 2px 8px #337be811',
              } : {}),
              ...(lang === 'de' || lang === 'en'
                ? { fontSize: '0.93em', minHeight: 46, padding: '11px 0 10px 0', letterSpacing: '-0.5px' }
                : {}),
            }}
          >
            <span style={{ whiteSpace: 'pre-line', lineHeight: 1.18 }}>{t(f.labelKey)}</span>
          </button>
        ))}
      </div>

      {/* 高額当選売場情報ボタン */}
      <div style={{
        width: '100%',
        maxWidth: 440,
        margin: '0 auto 16px auto',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <button
          onClick={() => handleFeatureChange('winning')}
          style={{
            width: '100%',
            background: feature === 'winning' ? '#f8de97' : '#fffdfa',
            color: '#ad8800',
            border: '2.2px solid #e7d0b6',
            borderRadius: 13,
            fontWeight: 700,
            fontSize: '1.16em',
            letterSpacing: '0.08em',
            padding: '16px 0',
            boxShadow: '0 2px 12px #f5e5b533',
            cursor: 'pointer',
            transition: 'all 0.14s',
          }}
        >
          {t('winning_outlet')}
        </button>
      </div>

      {/* メイン表示エリア */}
      <div style={{ width: '100%', position: 'relative' }}>
        {feature === 'past' && (
          <div className="search-area" style={{ color: '#222' }}>
            <PastResultsPro jsonUrl={selectedUrl} lotoType={selectedTabObj.key} />
          </div>
        )}
        {feature === 'diagnosis' && (
          <Diagnosis jsonUrl={selectedUrl} lotoType={selectedTabObj.key} textColor={textColor} />
        )}
        {feature === 'prediction' && (
          <Prediction lotoType={selectedTabObj.key} textColor={textColor} />
        )}
        {feature === 'settings' && (
          <Settings
            onThemeColorChange={handleThemeColorChange}
            onFontChange={handleFontChange}
            onTextColorChange={handleTextColorChange}
            onDefaultLotoChange={handleDefaultLotoChange}
            onDefaultMenuChange={handleDefaultMenuChange}
            defaultLotoType={settings.defaultLotoType}
            defaultMenu={settings.defaultMenu}
            themeColor={themeColor}
            font={font}
            textColor={textColor}
          />
        )}
        {feature === 'winning' && <WinningOutlet />}
      </div>

      {/* ガイド文＆リンク */}
      <div style={{
        background: '#f8fafd',
        borderRadius: 12,
        border: '1px solid #eef1f7',
        margin: '32px 0 8px 0',
        padding: '15px 20px 5px 20px',
        fontSize: '1em',
      }}>
        <a
          href="https://www.kujitonari.net/"
          target="_blank"
          rel="noopener"
          style={{ color: '#1767a7', textDecoration: 'underline', fontWeight: 600 }}
        >
          {t('blog')}
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
        <span>{t('by_tonari')}</span>
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
        <span style={{ fontSize: '0.90em', marginLeft: 2 }}>{t('tonari_supports')}</span>
      </div>
    </div>
  );
}