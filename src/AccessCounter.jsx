import { useEffect } from 'react';

export default function NinjaCounter() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//xa.shinobi.jp/ufo/192060200";
    script.type = "text/javascript";
    document.body.appendChild(script);

    // アンマウント時のクリーンアップ
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 画像部分だけ（通常表示）
  return (
    <a href="//xa.shinobi.jp/bin/gg?192060200" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginLeft: 10 }}>
      <img
        src="//xa.shinobi.jp/bin/ll?192060200"
        alt="Ninja Access Counter"
        style={{ border: 0, verticalAlign: 'text-bottom' }}
      />
      <img
        src="//img.shinobi.jp/tadaima/fj.gif"
        width={19}
        height={11}
        alt=""
        style={{ margin: 0, verticalAlign: 'text-bottom', marginLeft: 2 }}
      />
    </a>
  );
}