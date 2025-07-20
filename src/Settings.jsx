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

  useEffect(() => { setSelectedLoto(defaultLotoType || 'loto6'); }, [defaultLotoType]);
  useEffect(() => { setSelectedMenu(defaultMenu || 'past'); }, [defaultMenu]);
  useEffect(() => { setSelectedFont(font || FONT_OPTIONS[0].value); }, [font]);
  useEffect(() => {
    setSelectedColor(themeColor || '#fafcff');
    setCustomColor('');
  }, [themeColor]);

  const handleLotoChange = val => {
    setSelectedLoto(val);
    onDefaultLotoChange?.(val);
  };
  const handleMenuChange = val => {
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
      {/* ...中略（設定項目）... */}

      <h2 style={{ fontSize: '1.10em', margin: '18px 0 8px' }}>ガイド</h2>
      <ul style={{ fontSize: '0.98em', marginTop: 8, paddingLeft: 18, marginBottom: 0, color: '#222' }}>
        <li><strong>PWAとしてインストール可能：</strong>以下の手順でホーム画面に追加すれば、アプリのように起動できます。</li>
<ul style="margin: 0 0 10px 1.1em; padding-left: 1.1em;">
  <li><b>iPhone（Safari）：</b> 画面下の <b>「共有」ボタン</b> → <b>「ホーム画面に追加」</b> をタップ</li>
  <li><b>Android（Chrome）：</b> 画面右上 <b>「︙」メニュー</b> → <b>「ホーム画面に追加」</b> をタップ</li>
  <li><b>PC（Chrome）：</b> アドレスバー右端の「インストール」ボタンからアプリ化できます</li>
  <li>ホーム画面アイコンからいつでもアプリ感覚でアクセス可能です</li>
  <li style="color:#248; font-size:0.96em;">※ PWA対応なので、アップデートは自動で反映されます</li>
</ul>
        <li>最新のロト抽せん結果・出現傾向は自動で取得・反映されます。</li>
        <li>「となり流ズバリ予想」「構成タイプ判定」など独自機能をすべて無料で利用可能です。</li>
        <li>すべて広告表示なし、アカウント登録も不要。どなたでも安心して使えます。</li>
        <li>当アプリの各種データ・分析結果は公式サイトから取得した過去結果一覧のCSVと照合済み、正確性を最優先しています。</li>
      </ul>

      <ul style={{ margin: '0 0 10px 1.1em', paddingLeft: '1.1em' }}>
        <li><b>iPhone（Safari）：</b> 画面下の <b>「共有」ボタン</b> → <b>「ホーム画面に追加」</b> をタップ</li>
        <li><b>Android（Chrome）：</b> 画面右上 <b>「︙」メニュー</b> → <b>「ホーム画面に追加」</b> をタップ</li>
        <li><b>PC（Chrome）：</b> アドレスバー右端の「インストール」ボタンからアプリ化できます</li>
        <li>ホーム画面アイコンからいつでもアプリ感覚でアクセス可能です</li>
        <li style={{ color: '#248', fontSize: '0.96em' }}>※ PWA対応なので、アップデートは自動で反映されます</li>
      </ul>

      {/* ...中略（リンク群・バージョン）... */}
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
