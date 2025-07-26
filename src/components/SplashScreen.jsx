import { useEffect } from "react";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1000); // 1秒後にスプラッシュを終了
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-24 h-24 mx-auto mb-4"
        />
        <p className="text-gray-700 text-lg">読み込み中…</p>
      </div>
    </div>
  );
}