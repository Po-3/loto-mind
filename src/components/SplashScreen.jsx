// src/components/SplashScreen.jsx

export default function SplashScreen({ onFinish }) {
  // 自動非表示のタイマー（任意）
  // useEffect(() => {
  //   const timer = setTimeout(onFinish, 1500); // 1.5秒後に消す例
  //   return () => clearTimeout(timer);
  // }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center">
        <img
          src="/logo.png" // パスは必要に応じて変更
          alt="Logo"
          className="w-24 h-24 mx-auto mb-4"
        />
        <p className="text-gray-700 text-lg">読み込み中…</p>
      </div>
    </div>
  );
}