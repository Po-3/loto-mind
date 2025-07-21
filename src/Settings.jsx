import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

// フォント選択肢
const FONT_OPTIONS = [
  { label: 'default_font', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans JP", sans-serif' },
  { label: 'serif_font', value: 'serif, "Times New Roman", "Noto Serif JP", "YuMincho", "ヒラギノ明朝 ProN", "MS P明朝"' },
  { label: 'monospace_font', value: 'monospace, "Menlo", "Consolas", "Liberation Mono", "Courier New"' },
];

// カラー
const COLOR_PRESETS = [
  { name: 'tonari_color', value: '#fafcff' },
  { name: 'ivory', value: '#f9f6ee' },
  { name: 'simple_gray', value: '#eeeeee' },
  { name: 'sakura_pink', value: '#ffe4e1' },
  { name: 'light_blue', value: '#d1f0ff' },
  { name: 'white', value: '#ffffff' }
];

const PaletteIcon = ({ size = 27 }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" style={{ verticalAlign: 'middle', marginRight: 2 }}>
    <circle cx="11" cy="11" r="10" fill="#f7c873" stroke="#be9000" strokeWidth="1.2"/>
    <circle cx="7.5" cy="8" r="1.5" fill="#ed3a45"/>
    <circle cx="11.5" cy="6.8" r="1.2" fill="#42c6ff"/>
    <circle cx="15.1" cy="9.3" r="1.2" fill="#74e088"/>
    <circle cx="13.8" cy="13.4" r="1.2" fill="#fff78d"/>
    <circle cx="8.3" cy="14.1" r="1.2" fill="#e883d3"/>
  </svg>
);

export default function Settings({
  defaultLotoType,
  defaultMenu,
  font,
  themeColor,
  onDefaultLotoChange,
  onDefaultMenuChange,
  onFontChange,
  onThemeColorChange,
}) {
  const { t } = useTranslation();
  const [selectedLoto, setSelectedLoto] = useState(defaultLotoType || 'loto6');
  const [selectedMenu, setSelectedMenu] = useState(defaultMenu || 'past');
  const [selectedFont, setSelectedFont] = useState(font || FONT_OPTIONS[0].value);
  const [selectedColor, setSelectedColor] = useState(themeColor || '#fafcff');
  const [customColor, setCustomColor] = useState('');

  const [isUserSelectedLoto, setIsUserSelectedLoto] = useState(false);
  const [isUserSelectedMenu, setIsUserSelectedMenu] = useState(false);

  useEffect(() => {
    if (!isUserSelectedLoto) setSelectedLoto(defaultLotoType || 'loto6');
    // eslint-disable-next-line
  }, [defaultLotoType]);
  useEffect(() => {
    if (!isUserSelectedMenu) setSelectedMenu(defaultMenu || 'past');
    // eslint-disable-next-line
  }, [defaultMenu]);
  useEffect(() => { setSelectedFont(font || FONT_OPTIONS[0].value); }, [font]);
  useEffect(() => {
    setSelectedColor(themeColor || '#fafcff');
    setCustomColor('');
  }, [themeColor]);

  const handleLotoChange = val => {
    setIsUserSelectedLoto(true);
    setSelectedLoto(val);
    onDefaultLotoChange?.(val);
  };
  const handleMenuChange = val => {
    setIsUserSelectedMenu(true);
    setSelectedMenu(val);
    onDefaultMenuChange?.(val);
  };
  const handleFontChange = val => {
    setSelectedFont(val);
    onFontChange?.(val);
  };
  const handlePresetColor = color => {
    setSelectedColor(color);
    setCustomColor('');
    onThemeColorChange?.(color);
  };
  const handleCustomColor = color => {
    setSelectedColor(color);
    setCustomColor(color);
    onThemeColorChange?.(color);
  };

  if (!selectedLoto || !selectedMenu || !selectedFont || !selectedColor) {
    return <div>{t('settings_loading')}</div>;
  }

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '1.10em', margin: '8px 0' }}>{t('settings')}</h2>

      <div style={settingBlock}>
        <strong>{t('default_loto_type')}：</strong>
        <select value={selectedLoto} onChange={e => handleLotoChange(e.target.value)} style={selectStyle}>
          {[{ label: t('miniloto'), value: 'miniloto' }, { label: t('loto6'), value: 'loto6' }, { label: t('loto7'), value: 'loto7' }].map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={settingBlock}>
        <strong>{t('default_menu')}：</strong>
        <select value={selectedMenu} onChange={e => handleMenuChange(e.target.value)} style={selectStyle}>
          {[{ label: t('past_search'), value: 'past' }, { label: t('diagnosis'), value: 'diagnosis' }, { label: t('prediction'), value: 'prediction' }, { label: t('settings'), value: 'settings' }].map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={settingBlock}>
        <strong>{t('screen_font')}：</strong>
        <select value={selectedFont} onChange={e => handleFontChange(e.target.value)} style={selectStyle}>
          {FONT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
          ))}
        </select>
        <span style={{ marginLeft: 12, fontSize: '0.93em', fontFamily: selectedFont, borderBottom: '1px dotted #bbb' }}>
          {t(FONT_OPTIONS.find(f => f.value === selectedFont)?.label || '')}
        </span>
      </div>

      <div style={settingBlock}>
        <strong>{t('background_color')}：</strong>
        <span style={{ display: 'inline-flex', gap: 4, verticalAlign: 'middle', alignItems: 'center' }}>
          {COLOR_PRESETS.map(c => (
            <button key={c.value} title={t(c.name)} style={{
              width: 28, height: 28, borderRadius: '50%',
              border: selectedColor === c.value ? '2px solid #333' : '1px solid #ccc',
              background: c.value, cursor: 'pointer', marginRight: 2
            }} onClick={() => handlePresetColor(c.value)} />
          ))}
          <label style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            border: customColor ? '2px solid #333' : '1.4px solid #aaa', borderRadius: 7, padding: '2px 6px',
            marginLeft: 4, background: '#fff', transition: 'border .13s'
          }}>
            <PaletteIcon size={22} />
            <input type="color" tabIndex={-1} value={customColor || selectedColor} onChange={e => handleCustomColor(e.target.value)}
              style={{ width: 24, height: 22, border: 'none', background: 'none', marginLeft: -4, cursor: 'pointer', opacity: 0, position: 'absolute' }}
              aria-label={t('custom_color')} />
          </label>
        </span>
        <span style={{ marginLeft: 10, fontSize: '0.93em', color: '#888' }}>{selectedColor}</span>
      </div>

      <h2 style={{ fontSize: '1.10em', margin: '18px 0 8px' }}>{t('guide')}</h2>
      <ul style={{ fontSize: '0.98em', marginTop: 8, paddingLeft: 18, marginBottom: 0, color: '#222' }}>
        <li>
          <strong>{t('pwa_installable')}：</strong>
          {t('pwa_install_steps')}
          <ul style={{ margin: '8px 0 10px 1.1em', paddingLeft: '1.1em' }}>
            <li><b>{t('iphone_safari')}：</b> {t('iphone_steps')}</li>
            <li><b>{t('android_chrome')}：</b> {t('android_steps')}</li>
            <li><b>{t('pc_chrome')}：</b> {t('pc_steps')}</li>
            <li>{t('home_icon_info')}</li>
            <li style={{ color:'#248', fontSize:'0.96em' }}>{t('pwa_auto_update')}</li>
          </ul>
        </li>
        <li>{t('latest_loto_results_auto')}</li>
        <li>{t('all_free_features')}</li>
        <li>{t('no_ads_no_account')}</li>
        <li>{t('data_verified_csv')}</li>
      </ul>
      <div style={{ marginTop: 16, fontSize: '0.97em' }}>
        <a href="https://www.kujitonari.net/" target="_blank" rel="noopener noreferrer">
          {t('official_blog')}
        </a><br />
        <a href="https://note.com/kujitonari" target="_blank" rel="noopener noreferrer">
          {t('note')}
        </a><br />
        <a href="https://x.com/tkjtonari" target="_blank" rel="noopener noreferrer">
          {t('x_latest')}
        </a><br />
        <a href="https://www.youtube.com/@%E3%81%8F%E3%81%98%E3%81%A8%E3%81%AA%E3%82%8A" target="_blank" rel="noopener noreferrer">
          {t('youtube_channel')}
        </a>
      </div>
      <div style={{ marginTop: 18, color: '#888', fontSize: '0.96em', display: 'flex', justifyContent: 'space-between' }}>
         <span>
          {t('disclaimer_1')}<br />
          {t('disclaimer_2')}<br />
          <span style={{ fontSize: '0.92em', display: 'inline-block', marginTop: 2 }}>
            <br/><a href="https://www.kujitonari.net/LotoMind" target="_blank" rel="noopener noreferrer" style={{ color: '#888' }}>
              Ver 1.03（2025-07-21）
            </a>
          </span>
        </span>
      </div>
    </div>
  );
}

// --- スタイル ---
const selectStyle = {
  fontSize: '1em',
  marginLeft: 10,
  padding: '5px 16px',
  borderRadius: 6,
  border: '1px solid #bbb'
};

const settingBlock = {
  margin: '14px 0 10px'
};