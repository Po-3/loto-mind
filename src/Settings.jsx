import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

// フォント選択肢
const FONT_OPTIONS = [
  { labelKey: 'font_standard', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans JP", sans-serif' },
  { labelKey: 'font_serif', value: 'serif, "Times New Roman", "Noto Serif JP", "YuMincho", "ヒラギノ明朝 ProN", "MS P明朝"' },
  { labelKey: 'font_monospace', value: 'monospace, "Menlo", "Consolas", "Liberation Mono", "Courier New"' },
];

// 背景色プリセット
const BG_COLOR_PRESETS = [
  { labelKey: 'color_tonari', value: '#fafcff' },
  { labelKey: 'color_ivory', value: '#f9f6ee' },
  { labelKey: 'color_gray', value: '#eeeeee' },
  { labelKey: 'color_sakura', value: '#ffe4e1' },
  { labelKey: 'color_blue', value: '#d1f0ff' },
  { labelKey: 'color_white', value: '#ffffff' }
];

// 文字色プリセット
const TEXT_COLOR_PRESETS = [
  { labelKey: 'color_black', value: '#191919' },
  { labelKey: 'color_white', value: '#ffffff' },
  { labelKey: 'color_gray', value: '#555555' },
  { labelKey: 'color_brown', value: '#946800' }
];

// 言語選択肢
const LANG_OPTIONS = [
  { label: '日本語', value: 'ja' },
  { label: 'English', value: 'en' }
];

const PaletteIcon = ({ size = 27 }) => (
  <svg width="22" height="22" viewBox="0 0 22 22">
    <rect
      x="2"
      y="2"
      width="18"
      height="18"
      rx="6"
      ry="6"
      fill="#f7c873"
      stroke="#be9000"
      strokeWidth="1.2"
    />
    {[0,1,2,3,4].map(i => {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const cx = 11 + 7.5 * Math.cos(angle);
      const cy = 11 + 7.5 * Math.sin(angle);
      const colors = ["#ed3a45","#42c6ff","#74e088","#fff78d","#e883d3"];
      return (
        <circle key={i} cx={cx} cy={cy} r="1.2" fill={colors[i]} />
      );
    })}
  </svg>
);

// ▼ 言語切替カスタムUI
function LanguageDropdown({ selectedLang, onChange }) {
  const [open, setOpen] = useState(false);
  const sorted = [...LANG_OPTIONS].sort((a, b) =>
    a.value === selectedLang ? -1 : b.value === selectedLang ? 1 : 0
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block', minWidth: 120 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          fontSize: '1em',
          padding: '5px 20px',
          borderRadius: 8,
          border: '1px solid #bbb',
          background: '#f7fafd',
          cursor: 'pointer',
          minWidth: 80
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {sorted[0].label}
        <span style={{ marginLeft: 6, fontSize: '0.94em', color: '#999' }}>▼</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute', left: 0, top: '110%', background: '#fff', border: '1px solid #ddd',
            boxShadow: '0 4px 18px #0001', borderRadius: 10, marginTop: 5, minWidth: 110, zIndex: 50
          }}
          tabIndex={-1}
        >
          {sorted.map(lang => (
            <div
              key={lang.value}
              onClick={() => {
                if (lang.value !== selectedLang) {
                  onChange(lang.value);
                }
                setOpen(false);
              }}
              style={{
                fontWeight: lang.value === selectedLang ? 'bold' : undefined,
                color: lang.value === selectedLang ? '#1c6cff' : '#333',
                padding: '9px 16px 7px',
                cursor: lang.value === selectedLang ? 'default' : 'pointer',
                background: lang.value === selectedLang ? '#e6f3ff' : undefined,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.09em'
              }}
            >
              {lang.value === selectedLang && <span style={{ marginRight: 8, fontSize: '1.1em' }}>✓</span>}
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Settings({
  defaultLotoType,
  defaultMenu,
  font,
  themeColor,
  textColor,
  onDefaultLotoChange,
  onDefaultMenuChange,
  onFontChange,
  onThemeColorChange,
  onTextColorChange
}) {
  const { t, i18n } = useTranslation();

  const [selectedLang, setSelectedLang] = useState(i18n.language || 'ja');
  const [selectedLoto, setSelectedLoto] = useState(defaultLotoType || 'loto6');
  const [selectedMenu, setSelectedMenu] = useState(defaultMenu || 'past');
  const [selectedFont, setSelectedFont] = useState(font || FONT_OPTIONS[0].value);
  const [selectedColor, setSelectedColor] = useState(themeColor || BG_COLOR_PRESETS[0].value);
  const [customColor, setCustomColor] = useState('');
  const [selectedTextColor, setSelectedTextColor] = useState(textColor || TEXT_COLOR_PRESETS[0].value);
  const [customTextColor, setCustomTextColor] = useState('');

  const [isUserSelectedLoto, setIsUserSelectedLoto] = useState(false);
  const [isUserSelectedMenu, setIsUserSelectedMenu] = useState(false);

  useEffect(() => {
    if (!isUserSelectedLoto) setSelectedLoto(defaultLotoType || 'loto6');
  }, [defaultLotoType]);
  useEffect(() => {
    if (!isUserSelectedMenu) setSelectedMenu(defaultMenu || 'past');
  }, [defaultMenu]);
  useEffect(() => {
    setSelectedFont(font || FONT_OPTIONS[0].value);
  }, [font]);
  useEffect(() => {
    setSelectedColor(themeColor || BG_COLOR_PRESETS[0].value);
    setCustomColor('');
  }, [themeColor]);
  useEffect(() => {
    setSelectedTextColor(textColor || TEXT_COLOR_PRESETS[0].value);
    setCustomTextColor('');
  }, [textColor]);

  // ▼ カラーハンドラ
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
  const handlePresetTextColor = color => {
    setSelectedTextColor(color);
    setCustomTextColor('');
    onTextColorChange?.(color);
  };
  const handleCustomTextColor = color => {
    setSelectedTextColor(color);
    setCustomTextColor(color);
    onTextColorChange?.(color);
  };

  const handleLangChange = lang => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
  };
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

  if (!selectedLoto || !selectedMenu || !selectedFont || !selectedColor || !selectedTextColor) {
    return <div>{t('loading')}</div>;
  }

  const langLabel = selectedLang === 'ja' ? 'Language' : '言語';

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '1.10em', margin: '8px 0' }}>{t('settings')}</h2>

      <div style={settingBlock}>
        <strong>{langLabel}</strong>
        <LanguageDropdown selectedLang={selectedLang} onChange={handleLangChange} />
      </div>

      <div style={settingBlock}>
        <strong>{t('default_loto_type')}</strong>
        <select value={selectedLoto} onChange={e => handleLotoChange(e.target.value)} style={selectStyle}>
          {[{ label: t('miniloto'), value: 'miniloto' }, { label: t('loto6'), value: 'loto6' }, { label: t('loto7'), value: 'loto7' }].map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={settingBlock}>
        <strong>{t('default_menu')}</strong>
        <select value={selectedMenu} onChange={e => handleMenuChange(e.target.value)} style={selectStyle}>
          {[{ label: t('past'), value: 'past' }, { label: t('diagnosis'), value: 'diagnosis' }, { label: t('prediction'), value: 'prediction' }, { label: t('settings_tab'), value: 'settings' }].map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={settingBlock}>
        <strong>{t('screen_font')}</strong>
        <select value={selectedFont} onChange={e => handleFontChange(e.target.value)} style={selectStyle}>
          {FONT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
          ))}
        </select>
        <span style={{ marginLeft: 12, fontSize: '0.93em', fontFamily: selectedFont, borderBottom: '1px dotted #bbb' }}>
          {t(FONT_OPTIONS.find(f => f.value === selectedFont)?.labelKey || '')}
        </span>
      </div>

      {/* 背景色選択 */}
      <div style={settingBlock}>
        <strong>{t('background_color')}</strong>
        <span style={{ display: 'inline-flex', gap: 4, verticalAlign: 'middle', alignItems: 'center' }}>
          {BG_COLOR_PRESETS.map(c => (
            <button key={c.value} title={t(c.labelKey)} style={{
              width: 28, height: 28, borderRadius: 8,
              border: selectedColor === c.value ? '2.5px solid #333' : '1px solid #ccc',
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
        <span style={{ marginLeft: 10, fontSize: '0.93em', color: selectedColor }}>
          {t('selected_color', { color: selectedColor })}
        </span>
      </div>

      {/* 文字色選択 */}
      <div style={settingBlock}>
        <strong>{t('text_color')}</strong>
        <span style={{ display: 'inline-flex', gap: 4, verticalAlign: 'middle', alignItems: 'center' }}>
          {TEXT_COLOR_PRESETS.map(c => (
            <button key={c.value} title={t(c.labelKey)} style={{
              width: 28, height: 28, borderRadius: 8,
              border: selectedTextColor === c.value ? '2.5px solid #333' : '1px solid #ccc',
              background: c.value, cursor: 'pointer', marginRight: 2
            }} onClick={() => handlePresetTextColor(c.value)} />
          ))}
          <label style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            border: customTextColor ? '2px solid #333' : '1.4px solid #aaa', borderRadius: 7, padding: '2px 6px',
            marginLeft: 4, background: '#fff', transition: 'border .13s'
          }}>
            <PaletteIcon size={22} />
            <input type="color" tabIndex={-1} value={customTextColor || selectedTextColor} onChange={e => handleCustomTextColor(e.target.value)}
              style={{ width: 24, height: 22, border: 'none', background: 'none', marginLeft: -4, cursor: 'pointer', opacity: 0, position: 'absolute' }}
              aria-label={t('custom_color')} />
          </label>
        </span>
        <span style={{ marginLeft: 10, fontSize: '0.93em', color: selectedTextColor }}>
          {t('selected_color', { color: selectedTextColor })}
        </span>
      </div>

      {/* --- ガイド／公式リンク --- */}
<h2 style={{ fontSize: '1.10em', margin: '18px 0 8px', color: textColor }}>
  {t('guide_title')}
</h2>
<ul style={{ fontSize: '0.98em', marginTop: 8, paddingLeft: 18, marginBottom: 0, color: textColor }}>
  <li>
    <strong>{t('guide_pwa_title')}</strong>
    <ul style={{ margin: '8px 0 10px 1.1em', paddingLeft: '1.1em' }}>
      <li><b>{t('guide_pwa_iphone')}</b></li>
      <li><b>{t('guide_pwa_android')}</b></li>
      <li><b>{t('guide_pwa_pc')}</b></li>
      <li>{t('guide_pwa_icon')}</li>
      <li style={{ color: textColor, fontSize:'0.96em' }}>
        <span>{t('guide_pwa_update')}</span>
      </li>
    </ul>
  </li>
  <li>{t('guide_auto_update')}</li>
  <li>{t('guide_features')}</li>
  <li>{t('guide_no_ads')}</li>
  <li>{t('guide_data_accuracy')}</li>
</ul>
<div style={{ marginTop: 16, fontSize: '0.97em', color: textColor }}>
  <a href="https://www.kujitonari.net/" target="_blank" rel="noopener noreferrer">{t('guide_blog')}</a><br />
  <a href="https://note.com/kujitonari" target="_blank" rel="noopener noreferrer">{t('guide_note')}</a><br />
  <a href="https://x.com/tkjtonari" target="_blank" rel="noopener noreferrer">{t('guide_x')}</a><br />
  <a href="https://www.youtube.com/@%E3%81%8F%E3%81%98%E3%81%A8%E3%81%AA%E3%82%8A" target="_blank" rel="noopener noreferrer">{t('guide_youtube')}</a>
</div>
<div style={{ marginTop: 18, color: textColor, fontSize: '0.96em', display: 'flex', justifyContent: 'space-between' }}>
  <span>
    {t('guide_disclaimer')}
    <br />
    <span style={{ fontSize: '0.92em', display: 'inline-block', marginTop: 2 }}>
      <a href="https://www.kujitonari.net/LotoMind" target="_blank" rel="noopener noreferrer" style={{ color: textColor }}>
        Ver 1.08（2025-07-23）
      </a>
    </span>
  </span>
</div>
    </div>
  );
}

// --- Style群 ---
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