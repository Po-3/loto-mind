import { useEffect, useState } from 'react';

// 豊富なフォント選択肢（追加歓迎！）
const FONT_OPTIONS = [
  { label: '標準（system）', value: 'system-ui, Avenir, Helvetica, Arial, sans-serif' },
  { label: 'メイリオ', value: 'Meiryo, "メイリオ", sans-serif' },
  { label: '游ゴシック', value: '"Yu Gothic", YuGothic, "游ゴシック体", "YuGothic", sans-serif' },
  { label: 'Noto Sans JP', value: '"Noto Sans JP", sans-serif' },
  { label: 'BIZ UDゴシック', value: '"BIZ UD Gothic", "BIZ UDGothic", sans-serif' },
  { label: 'Roboto', value: 'Roboto, Arial, sans-serif' },
  { label: 'Inter', value: 'Inter, Arial, sans-serif' },
  { label: 'M PLUS Rounded', value: '"M PLUS Rounded 1c", sans-serif' },
  { label: 'BIZ UD明朝', value: '"BIZ UDMincho", serif' },
  { label: '明朝（Noto Serif）', value: '"Noto Serif JP", serif' }
];

// カラーパレット（プリセット＋カスタム対応）
const COLOR_PRESETS = [
  { name: 'となりカラー', value: '#fafcff' },
  { name: 'アイボリー', value: '#f9f6ee' },
  { name: 'シンプルグレー', value: '#eeeeee' },
  { name: '桜ピンク', value: '#ffe4e1' },
  { name: 'ライトブルー', value: '#d1f0ff' },
  { name: 'ホワイト', value: '#ffffff' }
];

const LOTO_OPTIONS = [
  { label: 'ミニロト', value: 'miniloto' },
  { label: 'ロト6', value: 'loto6' },
  { label: 'ロト7', value: 'loto7' }
];

const MENU_OPTIONS = [
  { label: '過去検索', value: 'past' },
  { label: 'となり診断', value: 'diagnosis' },
  { label: 'ズバリ予想', value: 'prediction' },
  { label: '設定', value: 'settings' }
];

// シンプルなSVGパレットアイコン（Reactコンポーネント化）
const PaletteIcon = ({ size = 22 }) => (
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
  themeColor, // ← 背景色hex値
  onDefaultLotoChange,
  onDefaultMenuChange,
  onFontChange,
  onThemeColorChange,
}) {
  // 内部状態（propsから初期値で、props変化時は追従）
  const [selectedLoto, setSelectedLoto] = useState(defaultLotoType || 'loto6');
  const [selectedMenu, setSelectedMenu] = useState(defaultMenu || 'past');
  const [selectedFont, setSelectedFont] = useState(font || FONT_OPTIONS[0].value);
  const [selectedColor, setSelectedColor] = useState(themeColor || '#fafcff');
  // カスタム選択色（プリセット選択時は空に戻す）
  const [customColor, setCustomColor] = useState('');

  useEffect(() => { setSelectedLoto(defaultLotoType || 'loto6'); }, [defaultLotoType]);
  useEffect(() => { setSelectedMenu(defaultMenu || 'past'); }, [defaultMenu]);
  useEffect(() => { setSelectedFont(font || FONT_OPTIONS[0].value); }, [font]);
  useEffect(() => {
    setSelectedColor(themeColor || '#fafcff');
    setCustomColor('');
  }, [themeColor]);

  // ハンドラ
  const handleLotoChange = (val) => {
    setSelectedLoto(val);
    onDefaultLotoChange && onDefaultLotoChange(val);
  };
  const handleMenuChange = (val) => {
    setSelectedMenu(val);
    onDefaultMenuChange && onDefaultMenuChange(val);
  };
  const handleFontChange = (val) => {
    setSelectedFont(val);
    onFontChange && onFontChange(val);
  };
  const handlePresetColor = (color) => {
    setSelectedColor(color);
    setCustomColor('');
    onThemeColorChange && onThemeColorChange(color);
  };
  const handleCustomColor = (color) => {
    setSelectedColor(color);
    setCustomColor(color);
    onThemeColorChange && onThemeColorChange(color);
  };

  // 安全ガード
  if (
    typeof selectedLoto === 'undefined' ||
    typeof selectedMenu === 'undefined' ||
    typeof selectedFont === 'undefined' ||
    typeof selectedColor === 'undefined'
  ) {
    return <div>設定を読み込み中…</div>;
  }

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '1.10em', margin: '8px 0' }}>設定</h2>

      <div style={settingBlock}>
        <strong>デフォルトロト種別：</strong>
        <select
          value={selectedLoto}
          onChange={e => handleLotoChange(e.target.value)}
          style={selectStyle}
        >
          {LOTO_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={settingBlock}>
        <strong>起動時の初期メニュー：</strong>
        <select
          value={selectedMenu}
          onChange={e => handleMenuChange(e.target.value)}
          style={selectStyle}
        >
          {MENU_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* フォント選択 */}
      <div style={settingBlock}>
        <strong>画面フォント：</strong>
        <select
          value={selectedFont}
          onChange={e => handleFontChange(e.target.value)}
          style={selectStyle}
        >
          {FONT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span style={{
          marginLeft: 12, fontSize: '0.93em',
          fontFamily: selectedFont, borderBottom: '1px dotted #bbb'
        }}>
          {FONT_OPTIONS.find(f => f.value === selectedFont)?.label || ''}
        </span>
      </div>

      {/* カラーパレット＋カラーピッカー */}
      <div style={settingBlock}>
        <strong>背景カラー：</strong>
        <span style={{ display: 'inline-flex', gap: 4, verticalAlign: 'middle', alignItems: 'center' }}>
          <PaletteIcon />
          {COLOR_PRESETS.map(c =>
            <button
              key={c.value}
              title={c.name}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                border: selectedColor === c.value ? '2px solid #333' : '1px solid #ccc',
                background: c.value, cursor: 'pointer', marginRight: 2
              }}
              onClick={() => handlePresetColor(c.value)}
            />
          )}
          <input
            type="color"
            value={customColor || selectedColor}
            onChange={e => handleCustomColor(e.target.value)}
            style={{
              width: 34, height: 28, border: 'none', background: 'none',
              cursor: 'pointer', verticalAlign: 'middle', marginLeft: 3
            }}
            aria-label="カスタムカラー"
          />
        </span>
        <span style={{ marginLeft: 10, fontSize: '0.93em', color: '#888' }}>{selectedColor}</span>
      </div>

      {/* ↓ガイド文・リンク群はそのまま残す */}
      <h2 style={{ fontSize: '1.10em', margin: '18px 0 8px' }}>ガイド</h2>
      <ul style={{ fontSize: '0.98em', marginTop: 8, paddingLeft: 18, marginBottom: 0, color: '#222' }}>
        <li>最新のロト抽せん結果・出現傾向は自動で取得・反映されます。</li>
        <li>「となり流ズバリ予想」「構成タイプ判定」など独自機能をすべて無料で利用可能です。</li>
        <li>はてなブログ・note・X（旧Twitter）と今後も連携＆情報拡張を予定。</li>
        <li>すべて広告表示なし、アカウント登録も不要。どなたでも安心して使えます。</li>
        <li>当サイトの各種データ・分析結果は実際の公式CSVと照合済み、正確性を最優先しています。</li>
      </ul>
      <div style={{ marginTop: 16, fontSize: '0.97em' }}>
        <a href="https://www.kujitonari.net/" target="_blank" rel="noopener noreferrer">
          宝くじのとなり 公式ブログ（出現傾向＆予想の詳しい解説はこちら）
        </a>
        <br />
        <a href="https://note.com/kujitonari" target="_blank" rel="noopener noreferrer">
          note版 くじとなり（考察・有料予想はこちら）
        </a>
        <br />
        <a href="https://x.com/tkjtonari" target="_blank" rel="noopener noreferrer">
          X（旧Twitter）最新情報
        </a>
        <br />
        <a href="https://www.youtube.com/@%E3%81%8F%E3%81%98%E3%81%A8%E3%81%AA%E3%82%8A" target="_blank" rel="noopener noreferrer">
          くじとなり公式YouTubeチャンネル（動画も配信中！）
        </a>
      </div>
      <div style={{ marginTop: 18, color: '#888', fontSize: '0.96em' }}>
        ※ 本サービスはデータ検証およびエンタメ目的で提供しています。<br />
        予想・分析の結果に基づく購入はご自身の判断・責任でお願いします。
      </div>
    </div>
  );
}

// スタイル
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