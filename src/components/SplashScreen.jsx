import { useEffect } from "react";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
        zIndex: 9999,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: 96, height: 96, marginBottom: 16 }}
        />
        <p style={{ color: '#666', fontSize: 18 }}>読み込み中…</p>
      </div>
    </div>
  );
}