import { useState } from 'react';
import Quiz from './components/Quiz';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HowToPlay from './pages/HowToPlay';
import Contact from './pages/Contact';
import './App.css';

function App() {
  const [page, setPage] = useState('game');

  const goBack = () => setPage('game');

  if (page === 'privacy') return <div className="app"><PrivacyPolicy onBack={goBack} /></div>;
  if (page === 'howtoplay') return <div className="app"><HowToPlay onBack={goBack} /></div>;
  if (page === 'contact') return <div className="app"><Contact onBack={goBack} /></div>;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">今、何問目？</h1>
      </header>
      <main>
        <Quiz />
      </main>
      <footer className="app-footer">
        <nav className="footer-nav">
          <button onClick={() => setPage('howtoplay')}>遊び方</button>
          <span className="footer-sep">|</span>
          <button onClick={() => setPage('privacy')}>プライバシーポリシー</button>
          <span className="footer-sep">|</span>
          <button onClick={() => setPage('contact')}>お問い合わせ</button>
        </nav>
        <p>&copy; 2026 今、何問目？</p>
      </footer>
    </div>
  );
}

export default App;
