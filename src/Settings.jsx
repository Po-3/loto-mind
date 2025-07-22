import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

// フォント選択肢
const FONT_OPTIONS = [
  { labelKey: 'font_standard', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans JP", sans-serif' },
  { labelKey: 'font_serif', value: 'serif, "Times New Roman", "Noto Serif JP", "YuMincho", "ヒラギノ明朝 ProN", "MS P明朝"' },
  { labelKey: 'font_monospace', value: 'monospace, "Menlo", "Consolas", "Liberation Mono", "Courier New"' },
];

// 共通カラープリセット
const COLOR_PRESETS = [
  { labelKey: 'color_tonari', value: '#fafcff' },
  { labelKey: 'color_ivory', value: '#f9f6ee' },
  { labelKey: 'color_gray', value: '#eeeeee' },
  { labelKey: 'color_sakura', value: '#ffe4e1' },
  { labelKey: 'color_blue', value: '#d1f0ff' },
  { labelKey: 'color_white', value: '#ffffff' },
  { labelKey: 'color_black', value: '#191919' },
  { labelKey: 'color_red', value: '#ca2323' },
  { labelKey: 'color_green', value: '#009b6b' },
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
  onDefaultLotoChange,
  onDefaultMenuChange,
  onFontChange,
  onThemeColorChange,
}) {
  const { t, i18n } = useTranslation();

  const [selectedLang, setSelectedLang] = useState(i18n.language || 'ja');
  const [selectedLoto, setSelectedLoto] = useState(defaultLotoType || 'loto6');
  const [selectedMenu, setSelectedMenu] = useState(defaultMenu || 'past');
  const [selectedFont, setSelectedFont] = useState(font || FONT_OPTIONS[0].value);
  const [selectedColor, setSelectedColor] = useState(themeColor || '#fafcff');
  const [customColor, setCustomColor] = useState('');

  // ▼追加：文字色用
  const [selectedTextColor, setSelectedTextColor] = useState(localStorage.getItem('textColor') || '#191919');
  const [customTextColor, setCustomTextColor] = useState('');

  const [isUserSelectedLoto, setIsUserSelectedLoto] = useState(false);
  const [isUserSelectedMenu, setIsUserSelectedMenu] = useState(false);

  const handleLangChange = lang => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
  };

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
    setSelectedColor(themeColor || '#fafcff');
    setCustomColor('');
  }, [themeColor]);

  // ▼文字色をbody直反映したい場合（or ルートdivに直接style指定でも可）
  useEffect(() => {
    document.body.style.color = selectedTextColor;
  }, [selectedTextColor]);

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

  // ▼文字色（プリセット）
  const handlePresetTextColor = color => {
    setSelectedTextColor(color);
    setCustomTextColor('');
    localStorage.setItem('textColor', color);
  };
  // ▼文字色（カスタムパレット）
  const handleCustomTextColor = color => {
    setSelectedTextColor(color);
    setCustomTextColor(color);
    localStorage.setItem('textColor', color);
  };

  if (!selectedLoto || !selectedMenu || !selectedFont || !selectedColor) {
    return <div>{t('loading')}</div>;
  }

  // ★ここがポイント！
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
          {COLOR_PRESETS.map(c => (
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
          {COLOR_PRESETS.map(c => (
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