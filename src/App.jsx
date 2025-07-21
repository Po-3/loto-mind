import './i18n';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import PastResultsPro from './PastResultsPro';
import Diagnosis from './Diagnosis';
import Prediction from './Prediction';
import Settings from './Settings';

const tabs = [
  { key: 'miniloto', label: 'miniloto', url: 'https://po-3.github.io/miniloto-data/miniloto.json' },
  { key: 'loto6', label: 'loto6', url: 'https://po-3.github.io/loto6-data/loto6.json' },
  { key: 'loto7', label: 'loto7', url: 'https://po-3.github.io/loto7-data/loto7.json' },
];
const features = [
  { key: 'past', label: 'search_tool' },
  { key: 'diagnosis', label: 'diagnosis' },
  { key: 'prediction', label: 'prediction' },
  { key: 'settings', label: 'settings' }
];
const DEFAULT_BG_COLOR = '#fafcff';

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
  const { t, i18n } = useTranslation();

  const [settings, setSettings] = useState(getSettings);
  const [selectedTab, setSelectedTab] = useState(() => getStartupValue('LotoType', 'defaultLotoType', 'loto6'));
  const [feature, setFeature] = useState(() => getStartupValue('Menu', 'defaultMenu', 'past'));
  const [font, setFont] = useState(settings.font);
  const [themeColor, setThemeColor] = useState(settings.themeColor);
  const [showScrollBtns, setShowScrollBtns] = useState(true);

  // 言語切り替え用
  const [selectedLang, setSelectedLang] = useState(i18n.language || 'ja');
  const handleLangChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('loto_app_lang', lang); // お好みで
  };
  // 起動時: localStorageで保持した言語に自動切り替え
  useEffect(() => {
    const lang = localStorage.getItem('loto_app_lang');
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
      setSelectedLang(lang);
    }
    // eslint-disable-next-line
  }, []);

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
      {/* --- 言語切り替え --- */}
      <div style={{ textAlign: 'right', marginBottom: 6 }}>
        <label>
          <span style={{ marginRight: 8 }}>{t('language') || '言語'}</span>
          <select value={selectedLang} onChange={handleLangChange} style={{ fontSize: '1em', borderRadius: 7, padding: '3px 14px' }}>
            <option value="ja">日本語</option>
            <option value="en">English</option>
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁體中文</option>
          </select>
        </label>
      </div>

      {/* スクロールボタン */}
      {showPastScrollBtns && (
        <div style={scrollButtonContainer}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={scrollCircleButtonStyle} title={t('scroll_top') || "最上段へ"} aria-label={t('scroll_top') || "最上段へ"} type="button">
            <svg width="22" height="22" viewBox="0 0 24 24" style={{ display: 'block', margin: 'auto' }}>
              <polyline points="12 6 12 18" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
              <polyline points="6 12 12 6 18 12" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} style={scrollCircleButtonStyle} title={t('scroll_bottom') || "最下段へ"} aria-label={t('scroll_bottom') || "最下段へ"} type="button">
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
          <img src="/tonari.png" alt={t('tonari_icon_alt') || "となりアイコン"} style={logoIconStyle} />
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
            {t(tab.label)}
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
            <span style={{ whiteSpace: 'pre-line', lineHeight: 1.15 }}>{t(f.label)}</span>
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
          {t('tonari_blog') || "宝くじのとなりブログ"}
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
        <span>{t('tonari') || "となり"}</span>
        <img
          src="/tonari.png"
          alt={t('tonari_icon_alt') || "となりくん"}
          style={{
            width: 22,
            height: 22,
            marginLeft: 2,
            verticalAlign: 'middle',
            borderRadius: '50%',
            boxShadow: '0 1px 4px #bbb8',
          }}
        />
        <span style={{ fontSize: '0.90em', marginLeft: 2 }}>{t('always_supporting') || "がいつも応援中！"}</span>
      </div>
    </div>
  );
}