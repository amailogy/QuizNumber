import Quiz from './components/Quiz';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">何問目クイズ</h1>
        <p className="app-subtitle">今、何問目か覚えてる？</p>
      </header>
      <main>
        <Quiz />
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 何問目クイズ</p>
      </footer>
    </div>
  );
}

export default App;
