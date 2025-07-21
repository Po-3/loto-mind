import { useEffect } from 'react';

export default function NinjaCounter() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//xa.shinobi.jp/ufo/192060200";
    script.type = "text/javascript";
    document.body.appendChild(script);

    // クリーンアップ（アンマウント時に消すなら）
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ marginTop: 12 }}>
      {/* 非JavaScript環境用の代替イメージ（ほぼ不要だけど参考まで） */}
      <a href="//xa.shinobi.jp/bin/gg?192060200" target="_blank" rel="noopener noreferrer">
        <img
          src="//xa.shinobi.jp/bin/ll?192060200"
          alt="Ninja Access Counter"
          style={{ border: 0, verticalAlign: 'text-bottom' }}
        />
      </a>
      <span style={{ fontSize: 9 }}>
        <img
          src="//img.shinobi.jp/tadaima/fj.gif"
          width={19}
          height={11}
          alt=""
          style={{ margin: 0, verticalAlign: 'text-bottom' }}
        />
      </span>
    </div>
  );
}