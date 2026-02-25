import { useState, useRef, useEffect, useCallback } from 'react';
import { generateQuestion } from '../utils/questionGenerator';

const RESULT_DISPLAY_MS = 1000;
const TIME_LIMIT = 10; // 秒
const RANKING_KEY = 'quizNumberRanking';
const RANKING_MAX = 5;

function loadRanking() {
  try {
    return JSON.parse(localStorage.getItem(RANKING_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveScore(score) {
  if (score <= 0) return loadRanking();
  const ranking = loadRanking();
  ranking.push({ score, date: Date.now() });
  ranking.sort((a, b) => b.score - a.score);
  const trimmed = ranking.slice(0, RANKING_MAX);
  localStorage.setItem(RANKING_KEY, JSON.stringify(trimmed));
  return trimmed;
}

// SVG円形タイマーの設定
const CIRCLE_RADIUS = 140;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function Quiz() {
  const [started, setStarted] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | 'timeout' | null
  const [ranking, setRanking] = useState(() => loadRanking());
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // タイマー開始
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(TIME_LIMIT);
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, TIME_LIMIT - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
      }
    }, 50);
  }, []);

  // タイマー停止
  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  // 問題生成 & タイマー開始
  useEffect(() => {
    if (started && !gameOver && !result) {
      const q = generateQuestion(questionNumber, answerHistory);
      setQuestion(q);
      startTimer();
    }
    return () => stopTimer();
  }, [questionNumber, gameOver, result, started]);

  // タイムアウト検知
  useEffect(() => {
    if (timeLeft <= 0 && !result && !gameOver && started) {
      handleTimeOut();
    }
  }, [timeLeft, result, gameOver, started]);

  // 入力欄に常にフォーカス（モバイルでキーボードを維持）
  useEffect(() => {
    if (started && !gameOver && inputRef.current) {
      inputRef.current.focus();
    }
  }, [questionNumber, gameOver, result, started]);

  // フォーカスを強制的に維持（キーボードが消えないように）
  const handleBlur = useCallback(() => {
    if (started && !gameOver) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [started, gameOver]);

  // iOSでスクロールさせない
  useEffect(() => {
    const prevent = (e) => {
      if (started && !gameOver) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', prevent, { passive: false });
    return () => document.removeEventListener('touchmove', prevent);
  }, [started, gameOver]);

  // スタートボタン
  const handleStart = () => {
    setStarted(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleGameEnd = useCallback(() => {
    const finalScore = questionNumber - 1;
    const updated = saveScore(finalScore);
    setRanking(updated);
    setTimeout(() => {
      setGameOver(true);
    }, RESULT_DISPLAY_MS);
  }, [questionNumber]);

  const handleTimeOut = useCallback(() => {
    stopTimer();
    setResult('timeout');
    handleGameEnd();
  }, [stopTimer, handleGameEnd]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!question || result) return;

    const parsed = parseInt(userAnswer, 10);
    if (isNaN(parsed)) return;

    stopTimer();

    if (parsed === question.answer) {
      setResult('correct');
      setAnswerHistory((prev) => [...prev, question.answer]);
      setTimeout(() => {
        setResult(null);
        setUserAnswer('');
        setQuestionNumber((prev) => prev + 1);
      }, RESULT_DISPLAY_MS);
    } else {
      setResult('wrong');
      handleGameEnd();
    }
  }, [question, userAnswer, result, stopTimer, handleGameEnd]);

  const handleRetry = () => {
    setQuestionNumber(1);
    setAnswerHistory([]);
    setUserAnswer('');
    setGameOver(false);
    setResult(null);
    setQuestion(null);
    setTimeLeft(TIME_LIMIT);
    setStarted(false);
    setRanking(loadRanking());
  };

  const handleShare = () => {
    const score = questionNumber - 1;
    const best = ranking.length > 0 ? ranking[0].score : score;
    const text = `【何問目クイズ】${score}問正解！（ベスト: ${best}）\nあなたはどこまでいける？\n${window.location.href}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('結果をコピーしました！');
    }
  };

  // タイマーの進行率 (0〜1)
  const progress = timeLeft / TIME_LIMIT;
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  // タイマー色
  const getTimerColor = () => {
    if (result === 'correct') return 'var(--correct)';
    if (result === 'wrong' || result === 'timeout') return 'var(--wrong)';
    if (timeLeft <= 3) return 'var(--wrong)';
    if (timeLeft <= 5) return '#fdcb6e';
    return 'var(--primary)';
  };

  // === スタート画面 ===
  if (!started) {
    return (
      <div className="quiz-container">
        <div className="start-screen">
          {ranking.length > 0 && (
            <div className="ranking">
              <h3 className="ranking-title">RANKING</h3>
              <ol className="ranking-list">
                {ranking.map((entry, i) => (
                  <li key={i} className="ranking-item">
                    <span className="ranking-pos">{i + 1}</span>
                    <span className="ranking-score">{entry.score}問正解</span>
                    <span className="ranking-date">
                      {new Date(entry.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div className="start-circle">
            <svg viewBox="0 0 320 320" className="timer-svg">
              <circle cx="160" cy="160" r={CIRCLE_RADIUS} className="timer-track" />
              <circle
                cx="160" cy="160" r={CIRCLE_RADIUS}
                className="timer-progress"
                style={{
                  strokeDasharray: CIRCLE_CIRCUMFERENCE,
                  strokeDashoffset: 0,
                  stroke: 'var(--primary)',
                }}
              />
            </svg>
            <div className="timer-content">
              <p className="start-desc">今、何問目？</p>
            </div>
          </div>
          <button className="btn btn-primary btn-start" onClick={handleStart}>
            START
          </button>
        </div>
      </div>
    );
  }

  // === ゲームオーバー画面 ===
  if (gameOver) {
    const score = questionNumber - 1;
    return (
      <div className="quiz-container">
        <div className="game-over">
          {ranking.length > 0 && (
            <div className="ranking ranking-compact">
              <h3 className="ranking-title">RANKING</h3>
              <ol className="ranking-list">
                {ranking.map((entry, i) => (
                  <li key={i} className="ranking-item">
                    <span className="ranking-pos">{i + 1}</span>
                    <span className="ranking-score">{entry.score}問正解</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div className="game-over-circle">
            <svg viewBox="0 0 320 320" className="timer-svg">
              <circle cx="160" cy="160" r={CIRCLE_RADIUS} className="timer-track" />
            </svg>
            <div className="game-over-inner">
              <span className="game-over-label">GAME OVER</span>
              <span className="score-value">{score}</span>
              <span className="score-unit">問正解</span>
            </div>
          </div>
          {question && (
            <p className="correct-answer">
              正解は <strong>{question.answer}</strong> でした
            </p>
          )}
          <div className="game-over-buttons">
            <button className="btn btn-primary" onClick={handleRetry}>
              もう一度
            </button>
            <button className="btn btn-share" onClick={handleShare}>
              結果をシェア
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === プレイ画面 ===
  return (
    <div className="quiz-container">
      <div className={`timer-area ${result === 'wrong' || result === 'timeout' ? 'shake' : ''}`}>
        <svg viewBox="0 0 320 320" className="timer-svg">
          <circle cx="160" cy="160" r={CIRCLE_RADIUS} className="timer-track" />
          <circle
            cx="160" cy="160" r={CIRCLE_RADIUS}
            className="timer-progress"
            style={{
              strokeDasharray: CIRCLE_CIRCUMFERENCE,
              strokeDashoffset: strokeDashoffset,
              stroke: getTimerColor(),
              transition: result ? 'stroke 0.3s' : 'none',
            }}
          />
        </svg>

        <div className="timer-content">
          <h2 className="question-text">{question?.text}</h2>
        </div>

        {result === 'correct' && (
          <div className="result-overlay correct">
            <span className="result-icon">&#10003;</span>
          </div>
        )}
        {result === 'wrong' && (
          <div className="result-overlay wrong">
            <span className="result-icon">&#10007;</span>
          </div>
        )}
        {result === 'timeout' && (
          <div className="result-overlay timeout">
            <span className="result-icon">TIME UP</span>
          </div>
        )}
      </div>

      <div className="streak">正解数: {questionNumber - 1}</div>

      <form className="answer-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          enterKeyHint="go"
          className="answer-input"
          value={userAnswer}
          onChange={(e) => {
            if (!result) setUserAnswer(e.target.value);
          }}
          onBlur={handleBlur}
          placeholder="?"
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn btn-primary btn-answer"
          disabled={!userAnswer || !!result}
        >
          回答
        </button>
      </form>
    </div>
  );
}
