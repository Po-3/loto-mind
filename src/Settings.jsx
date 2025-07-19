import { useEffect, useState } from 'react';

const FONT_OPTIONS = [
  { label: '標準（system）', value: 'system-ui, Avenir, Helvetica, Arial, sans-serif' },
  { label: 'ゴシック（Noto Sans）', value: '"Noto Sans JP", sans-serif' },
  { label: '明朝（Noto Serif）', value: '"Noto Serif JP", serif' }
];

const THEME_OPTIONS = [
  { label: 'となりカラー', value: 'tonari' },
  { label: 'シンプルグレー', value: 'gray' },
  { label: 'アイボリー', value: 'ivory' }
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

export default function Settings({
  onThemeChange,
  onFontChange,
  onDefaultLotoChange,
  onDefaultMenuChange,
  defaultLotoType,
  defaultMenu,
  theme,
  font
}) {
  const [selectedLoto, setSelectedLoto] = useState(defaultLotoType || 'loto6');
  const [selectedMenu, setSelectedMenu] = useState(defaultMenu || 'prediction');
  const [selectedFont, setSelectedFont] = useState(font || FONT_OPTIONS[0].value);
  const [selectedTheme, setSelectedTheme] = useState(theme || 'tonari');

  // 設定保存・即反映
  useEffect(() => {
    localStorage.setItem('defaultLotoType', selectedLoto);
    if (onDefaultLotoChange) onDefaultLotoChange(selectedLoto);
  }, [selectedLoto]);

  useEffect(() => {
    localStorage.setItem('defaultMenu', selectedMenu);
    if (onDefaultMenuChange) onDefaultMenuChange(selectedMenu);
  }, [selectedMenu]);

  useEffect(() => {
    localStorage.setItem('font', selectedFont);
    if (onFontChange) onFontChange(selectedFont);
  }, [selectedFont]);

  useEffect(() => {
    localStorage.setItem('theme', selectedTheme);
    if (onThemeChange) onThemeChange(selectedTheme);
  }, [selectedTheme]);

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '1.10em', margin: '8px 0' }}>設定</h2>

      <div style={settingBlock}>
        <strong>デフォルトロト種別：</strong>
        <select value={selectedLoto} onChange={e => setSelectedLoto(e.target.value)} style={selectStyle}>
          {LOTO_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={settingBlock}>
        <strong>起動時の初期メニュー：</strong>
        <select value={selectedMenu} onChange={e => setSelectedMenu(e.target.value)} style={selectStyle}>
          {MENU_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={settingBlock}>
        <strong>画面フォント：</strong>
        <select value={selectedFont} onChange={e => setSelectedFont(e.target.value)} style={selectStyle}>
          {FONT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={settingBlock}>
        <strong>配色テーマ：</strong>
        <select value={selectedTheme} onChange={e => setSelectedTheme(e.target.value)} style={selectStyle}>
          {THEME_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
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