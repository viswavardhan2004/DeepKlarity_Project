import { useState } from 'react';
import GenerateQuiz from './components/GenerateQuiz';
import HistoryTable from './components/HistoryTable';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div className="container">
      <div className="header">
        <h1>WikiQuiz AI</h1>
        <p>Turn any Wikipedia article into a quiz instantly.</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          Generate Quiz
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      <div className="glass-card">
        {activeTab === 'generate' ? <GenerateQuiz /> : <HistoryTable />}
      </div>
    </div>
  );
}

export default App;
