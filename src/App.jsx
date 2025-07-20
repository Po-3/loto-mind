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
  { key: 'past', label: '過去検索' },
  { key: 'diagnosis', label: 'となり診断' },
  { key: 'prediction', label: 'ズバリ予想' },
  { key: 'settings', label: '設定' }
];
const DEFAULT_BG_COLOR = '#fafcff';

// 起動時の初期値取得（last_xxx優先、なければdefault_xxx）
function getStartupValue(key, defaultKey, fallback) {
  const last = localStorage.getItem('last_' + key);
  if (last) return last;
  return localStorage.getItem(defaultKey) || fallback;
}
// 各種設定一括取得
function getSettings() {
  return {
    defaultLotoType: localStorage.getItem('defaultLotoType') || 'loto6',
    defaultMenu: localStorage.getItem('defaultMenu') || 'past',
    font: localStorage.getItem('font') || 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    themeColor: localStorage.getItem('themeColor') || DEFAULT_BG_COLOR,
  };
}

export default function App() {
  const [settings, setSettings] = useState(getSettings());
  const [selectedTab, setSelectedTab] = useState(() => getStartupValue('LotoType', 'defaultLotoType', 'loto6'));
  const [feature, setFeature] = useState(() => getStartupValue('Menu', 'defaultMenu', 'past'));
  const [font, setFont] = useState(settings.font);
  const [themeColor, setThemeColor] = useState(settings.themeColor);
  const [showScrollBtns, setShowScrollBtns] = useState(true);
  const [pastReloadKey, setPastReloadKey] = useState(0);

  // 設定画面で変更された時
  const handleDefaultLotoChange = (type) => {
    localStorage.setItem('defaultLotoType', type);
    setSettings(getSettings());
    // ※ここではselectedTabは即変更しない
  };
  const handleDefaultMenuChange = (menu) => {
    localStorage.setItem('defaultMenu', menu);
    setSettings(getSettings());
    // ※ここでもfeatureは即変更しない
  };
  const handleFontChange = (fontVal) => {
    localStorage.setItem('font', fontVal);
    setFont(fontVal);
  };
  const handleThemeColorChange = (colorVal) => {
    localStorage.setItem('themeColor', colorVal);
    setThemeColor(colorVal);
  };

  // ユーザーが操作したら「last_xxx」を更新
  const handleTabChange = (tabKey) => {
    setSelectedTab(tabKey);
    localStorage.setItem('last_LotoType', tabKey);
  };
  const handleFeatureChange = (menu) => {
    setFeature(menu);
    localStorage.setItem('last_Menu', menu);
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

  const selectedUrl = tabs.find(t => t.key === selectedTab).url;
  const showPastScrollBtns = feature === 'past' && showScrollBtns;

  // --- UI ---
  return (
    <div style={containerStyle}>
      {/* ...（以下UI部分・レイアウトは変更なしでOK）... */}
      {/* 必要なら上記からコピペ */}
      {/* 省略 */}
    </div>
  );
}

// --- スタイル（すべてそのまま使ってOK） ---
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