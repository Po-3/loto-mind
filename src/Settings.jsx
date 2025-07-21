import { useEffect, useState } from 'react';

// フォント選択肢
const FONT_OPTIONS = [
  { label: '標準（推奨・全端末対応）', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, "Noto Sans JP", sans-serif' },
  { label: '明朝体（標準）', value: 'serif, "Times New Roman", "Noto Serif JP", "YuMincho", "ヒラギノ明朝 ProN", "MS P明朝"' },
  { label: '等幅（数字・表用）', value: 'monospace, "Menlo", "Consolas", "Liberation Mono", "Courier New"' },
];

// カラー
const COLOR_PRESETS = [
  { name: 'となりカラー', value: '#fafcff' },
  { name: 'アイボリー', value: '#f9f6ee' },
  { name: 'シンプルグレー', value: '#eeeeee' },
  { name: '桜ピンク', value: '#ffe4e1' },
  { name: 'ライトブルー', value: '#d1f0ff' },
  { name: 'ホワイト', value: '#ffffff' }
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
  const [selectedLoto, setSelectedLoto] = useState(defaultLotoType || 'loto6');
  const [selectedMenu, setSelectedMenu] = useState(defaultMenu || 'past');
  const [selectedFont, setSelectedFont] = useState(font || FONT_OPTIONS[0].value);
  const [selectedColor, setSelectedColor] = useState(themeColor || '#fafcff');
  const [customColor, setCustomColor] = useState('');

  // 「ユーザーが自分で一度でも選んだら以降は維持」フラグ
  const [isUserSelectedLoto, setIsUserSelectedLoto] = useState(false);
  const [isUserSelectedMenu, setIsUserSelectedMenu] = useState(false);

  useEffect(() => {
    if (!isUserSelectedLoto) {
      setSelectedLoto(defaultLotoType || 'loto6');
    }
    // eslint-disable-next-line
  }, [defaultLotoType]);
  useEffect(() => {
    if (!isUserSelectedMenu) {
      setSelectedMenu(defaultMenu || 'past');
    }
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
    return <div>設定を読み込み中…</div>;
  }

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '1.10em', margin: '8px 0' }}>設定</h2>

      <div style={settingBlock}>
        <strong>デフォルトロト種別：</strong>
        <select value={selectedLoto} onChange={e => handleLotoChange(e.target.value)} style={selectStyle}>
          {[{ label: 'ミニロト', value: 'miniloto' }, { label: 'ロト6', value: 'loto6' }, { label: 'ロト7', value: 'loto7' }].map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={settingBlock}>
        <strong>起動時の初期メニュー：</strong>
        <select value={selectedMenu} onChange={e => handleMenuChange(e.target.value)} style={selectStyle}>
          {[{ label: '過去検索', value: 'past' }, { label: 'となり診断', value: 'diagnosis' }, { label: 'ズバリ予想', value: 'prediction' }, { label: '設定', value: 'settings' }].map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={settingBlock}>
        <strong>画面フォント：</strong>
        <select value={selectedFont} onChange={e => handleFontChange(e.target.value)} style={selectStyle}>
          {FONT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span style={{ marginLeft: 12, fontSize: '0.93em', fontFamily: selectedFont, borderBottom: '1px dotted #bbb' }}>
          {FONT_OPTIONS.find(f => f.value === selectedFont)?.label || ''}
        </span>
      </div>

      <div style={settingBlock}>
        <strong>背景カラー：</strong>
        <span style={{ display: 'inline-flex', gap: 4, verticalAlign: 'middle', alignItems: 'center' }}>
          {COLOR_PRESETS.map(c => (
            <button key={c.value} title={c.name} style={{
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
              aria-label="Custom Color" />
          </label>
        </span>
        <span style={{ marginLeft: 10, fontSize: '0.93em', color: '#888' }}>{selectedColor}</span>
      </div>

      <h2 style={{ fontSize: '1.10em', margin: '18px 0 8px' }}>ガイド</h2>
      <ul style={{ fontSize: '0.98em', marginTop: 8, paddingLeft: 18, marginBottom: 0, color: '#222' }}>
        <li>
          <strong>PWAとしてインストール可能：</strong>
          以下の手順でホーム画面に追加すれば、アプリのように起動できます。
          <ul style={{ margin: '8px 0 10px 1.1em', paddingLeft: '1.1em' }}>
            <li><b>iPhone（Safari）：</b> 画面下の <b>「共有」ボタン</b> → <b>「ホーム画面に追加」</b> をタップ</li>
            <li><b>Android（Chrome）：</b> 画面右上 <b>「︙」メニュー</b> → <b>「ホーム画面に追加」</b> をタップ</li>
            <li><b>PC（Chrome）：</b> アドレスバー右端の「インストール」ボタンからアプリ化できます</li>
            <li>ホーム画面アイコンからいつでもアプリ感覚でアクセス可能です</li>
            <li style={{ color:'#248', fontSize:'0.96em' }}>※ PWA対応なので、アップデートは自動で反映されます</li>
          </ul>
        </li>
        <li>最新のロト抽せん結果は自動で取得・反映されます。</li>
        <li>「となり流ズバリ予想」「となり診断」「過去結果検索ツール」など独自機能をすべて無料で利用可能です。</li>
        <li>すべて広告表示なし、アカウント登録も不要。どなたでも安心して使えます。</li>
        <li>当アプリの各種データ・分析結果は公式サイトから取得した過去結果一覧のCSVと照合済み、正確性を最優先しています。</li>
      </ul>
      <div style={{ marginTop: 16, fontSize: '0.97em' }}>
        <a href="https://www.kujitonari.net/" target="_blank" rel="noopener noreferrer">
          宝くじのとなり 公式ブログ（出現傾向＆予想の詳しい解説はこちら）
        </a><br />
        <a href="https://note.com/kujitonari" target="_blank" rel="noopener noreferrer">
          note版 くじとなり（考察・有料予想はこちら）
        </a><br />
        <a href="https://x.com/tkjtonari" target="_blank" rel="noopener noreferrer">
          X（旧Twitter）最新情報
        </a><br />
        <a href="https://www.youtube.com/@%E3%81%8F%E3%81%98%E3%81%A8%E3%81%AA%E3%82%8A" target="_blank" rel="noopener noreferrer">
          くじとなり公式YouTubeチャンネル（動画も配信中！）
        </a>
      </div>
      <div style={{ marginTop: 18, color: '#888', fontSize: '0.96em', display: 'flex', justifyContent: 'space-between' }}>
         <span>
          ※ 本サービスはデータ検証およびエンタメ目的で提供しています。<br />
          予想・分析の結果に基づく購入はご自身の判断・責任でお願いします。<br />
          <span style={{ fontSize: '0.92em', display: 'inline-block', marginTop: 2 }}>
            <a href="https://www.kujitonari.net/LotoMind" target="_blank" rel="noopener noreferrer" style={{ color: '#888' }}>
              Ver 1.02（2025-07-21）
            </a>
          </span>
        </span>
      </div>
    </div>
  );
}

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