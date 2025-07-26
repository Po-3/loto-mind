// src/components/SplashScreen.jsx
import { useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1000); // 1秒で切り替え
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white animate-fade-in">
      <div className="flex flex-col items-center">
        <img
          src="/logo.png"
          alt="LotoMind Logo"
          className="w-28 h-28 mb-3"
        />
        <p className="text-sm text-gray-600">読み込み中…</p>
      </div>
    </div>
  );
}