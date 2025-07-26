// src/components/SplashScreen.jsx
import { useEffect } from "react";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1000); // 表示時間（1秒）
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center justify-center">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-24 h-24 mb-4"
          style={{ display: "block" }} // ← これが重要（CSS干渉回避）
        />
        <p className="text-gray-700 text-lg">読み込み中…</p>
      </div>
    </div>
  );
}