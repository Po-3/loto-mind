import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('prediction');
  return (
    <div>
      <div>
        <button>ミニロト</button>
        <button>ロト6</button>
        <button>ロト7</button>
      </div>
      <div>
        <button onClick={() => setActiveTab('past')}>過去検索</button>
        <button onClick={() => setActiveTab('diagnosis')}>数字くん診断</button>
        <button onClick={() => setActiveTab('prediction')}>ズバリ予想</button>
        <button onClick={() => setActiveTab('settings')}>設定</button>
      </div>
      <div>
        {activeTab}
      </div>
    </div>
  );
}

export default App;