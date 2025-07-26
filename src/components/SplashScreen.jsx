// src/components/SplashScreen.jsx
import { useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1000); // 表示時間：1秒
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white animate-fade-in">
      <img
        src="/logo.png"
        alt="LotoMind Logo"
        className="w-28 h-28 mb-4"
        style={{ objectFit: 'contain' }}
      />
      <p className="text-gray-600 text-sm tracking-wide">読み込み中…</p>
    </div>
  );
}