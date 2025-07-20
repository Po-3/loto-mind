import { useState } from 'react';

export default function App() {
  // 必ず「past」「diagnosis」「prediction」「settings」だけ許可
  const [feature, setFeature] = useState(() => {
    const v = localStorage.getItem('defaultMenu');
    return ['past','diagnosis','prediction','settings'].includes(v) ? v : 'past';
  });

  return (
    <div>
      <button onClick={() => setFeature('past')}>過去データ</button>
      <button onClick={() => setFeature('diagnosis')}>となり診断</button>
      <button onClick={() => setFeature('prediction')}>ズバリ予想</button>
      <button onClick={() => setFeature('settings')}>設定</button>
      <div>
        {feature === 'past' && <p>過去データ画面</p>}
        {feature === 'diagnosis' && <Diagnosis />}
        {feature === 'prediction' && <p>予想画面</p>}
        {feature === 'settings' && <p>設定画面</p>}
      </div>
    </div>
  );
}

function Diagnosis() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>診断画面（リロードせずに更新できる）</p>
      <button onClick={() => setCount(c => c + 1)}>診断を更新</button>
      <p>診断結果: {count}</p>
    </div>
  );
}