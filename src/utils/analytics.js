// Google Analytics イベント送信ユーティリティ

export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

// ゲーム開始
export function trackGameStart() {
  trackEvent('game_start');
}

// ゲームオーバー
export function trackGameOver(score, reason) {
  trackEvent('game_over', {
    score,
    reason, // 'wrong' | 'timeout'
  });
}

// シェアボタンクリック
export function trackShare(score) {
  trackEvent('share_click', {
    score,
  });
}

// リトライ
export function trackRetry() {
  trackEvent('game_retry');
}
